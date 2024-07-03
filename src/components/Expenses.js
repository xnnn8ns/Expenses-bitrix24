/* global BX24 */
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import AppInstaller from './AppInstaller'
import ExpenseForm from './ExpenseForm'
import ExpenseTable from './ExpenseTable'

const Expenses = () => {
	const [show, setShow] = useState(false);
	const [expenses, setExpenses] = useState([]);
	const [dealMargin, setDealMargin] = useState(0);
	const [dealId, setDealId] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const listId = '31';
	
	const fetchExpenses = useCallback(() => {
		BX24.callMethod('lists.element.get', {
			IBLOCK_TYPE_ID: 'lists',
			IBLOCK_ID: listId,
		}, (result) => {
			if (result.error()) {
				console.error('Ошибка при загрузке расходов:', result.error());
			} else {
				console.log('Полученные данные:', result.data());
				if (result.data()) {
					if (dealId) {
						const filtered = result.data().filter(expense => {
							const expenseDealId = expense.PROPERTY_129 ? Object.values(expense.PROPERTY_129)[0] : null;
							return expenseDealId && expenseDealId === dealId;
						});
						setExpenses(filtered);
					} else {
						setExpenses(result.data());
					}
				}
			}
		});
	}, [listId, dealId]);
	
	const fetchCurrentUser = useCallback(() => {
		BX24.callMethod('user.current', {}, (result) => {
			if (result.error()) {
				console.error('Ошибка при получении текущего пользователя:', result.error());
			} else {
				const currentUserData = result.data();
				setCurrentUser(currentUserData);
			}
		});
	}, []);
	
	useEffect(() => {
		BX24.init(() => {
			console.log('BX24 is ready', BX24.isAdmin());
			fetchCurrentUser();
			
			const placementInfo = BX24.placement.info();
			if (placementInfo && placementInfo.options && placementInfo.options.ID) {
				setDealId(placementInfo.options.ID);
			} else {
				console.error('Не удалось получить ID сделки');
			}
		});
	}, [fetchCurrentUser]);
	
	useEffect(() => {
		if (dealId) {
			fetchExpenses();
		}
	}, [dealId, fetchExpenses]);
	
	const handleClose = useCallback(() => setShow(false), []);
	const handleShow = useCallback(() => setShow(true), []);
	
	const addExpense = useCallback(async (expense) => {
		try {
			if (!currentUser) {
				console.error('Текущий пользователь не определен.');
				return;
			}
			const currentUserId = currentUser.ID;

			const newExpense = {
				IBLOCK_TYPE_ID: 'lists',
				IBLOCK_ID: listId,
				ELEMENT_CODE: `expense_${Date.now()}`,
				FIELDS: {
					NAME: expense.purpose,
					PROPERTY_125: expense.type,
					PROPERTY_113: formatDate(expense.plannedDate),
					PROPERTY_117: expense.amount,
					PROPERTY_131: currentUserId,
					PROPERTY_129: dealId,
				},
			};

			if (expense.actualDate) {
				newExpense.FIELDS.PROPERTY_115 = formatDate(expense.actualDate);
			}

			BX24.callMethod('lists.element.add', newExpense, function (result) {
				if (result.error()) {
					console.error('Ошибка при добавлении расхода:', result.error(), 'Запрос:', newExpense);
				} else {
					if (result.data()) {
						fetchExpenses();
						handleClose();
					}
				}
			});
		} catch (error) {
			console.error('Произошла ошибка при добавлении расхода:', error);
		}
	}, [currentUser, dealId, fetchExpenses, handleClose]);
	
	const formatDate = (date) => {
		if (!date) return ''
		const formattedDate = new Date(date)
		return formattedDate.toISOString()
	}
	
	return (
		<div className='container'>
			<AppInstaller onInstall={fetchExpenses} />
			<h1>Расходы по сделкам</h1>
			<Button variant='primary' className='mb-3' onClick={handleShow}>
				Добавить расход
			</Button>
			
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Добавить расход</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<ExpenseForm addExpense={addExpense} dealId={dealId} />
				</Modal.Body>
			</Modal>
			
			<ExpenseTable expenses={expenses} dealMargin={dealMargin} />
		</div>
	);
};

export default Expenses;