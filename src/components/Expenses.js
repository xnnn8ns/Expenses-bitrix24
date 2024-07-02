/* global BX24 */
import React, { useEffect, useState, useCallback } from 'react'
import { Button, Modal } from 'react-bootstrap'
import ExpenseForm from './ExpenseForm'
import ExpenseTable from './ExpenseTable'

const Expenses = () => {
	// Используемые хуки для управления состоянием и эффектами
	const [show, setShow] = useState(false); // Состояние для управления видимостью модального окна
	const [expenses, setExpenses] = useState([]); // Состояние для хранения списка расходов
	const [dealMargin, setDealMargin] = useState(0) // Состояние для хранения маржинальности сделки
	const [dealId, setDealId] = useState(null) // Состояние для хранения ID сделки
	const [forceUpdate, setForceUpdate] = useState(false) // Состояние для принудительного обновления компонента
	const listId = '31'
	
	const fetchExpenses = useCallback(async () => {
		const auth = BX24.getAuth()
		if (auth) {
			try {
				BX24.callMethod('lists.element.get', {
					IBLOCK_TYPE_ID: 'lists',
					IBLOCK_ID: listId,
					auth: auth.access_token
				}, function(result) {
					if (result.error()) {
						console.error('Ошибка при загрузке расходов:', result.error())
					} else {
						console.log('Полученные данные:', result.data())
						if (result.data()) {
							setExpenses(result.data())
						}
					}
				})
			} catch (error) {
				console.error('Ошибка при загрузке расходов:', error)
			}
		} else {
			console.error('Ошибка при получении токена доступа')
		}
	}, [listId]);
	
	useEffect(() => {
		BX24.init(() => {
			console.log('BX24 is ready', BX24.isAdmin())
			fetchExpenses() // Первоначальный вызов fetchExpenses при инициализации
			
			const placementInfo = BX24.placement.info()
			if (placementInfo && placementInfo.options && placementInfo.options.ID) {
				setDealId(placementInfo.options.ID)
			} else {
				console.error('Не удалось получить ID сделки')
			}
		})
	}, [fetchExpenses, forceUpdate])
	
	useEffect(() => {
		if (dealId && expenses.length > 0) {
			const filtered = expenses.filter(expense => {
				const expenseDealId = Object.values(expense.PROPERTY_129)[0]
				return expenseDealId && expenseDealId === dealId
			})
			setExpenses(filtered)
		}
	}, [dealId, expenses])
	
	const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(() => setShow(true), []);
	
	// Функция для добавления нового расхода
	const addExpense = useCallback(async (expense) => {
		try {
			// Получаем информацию о текущем пользователе
			BX24.callMethod('user.current', {}, function(result) {
				if (result.error()) {
					console.error('Ошибка при получении текущего пользователя:', result.error())
				} else {
					const currentUserId = result.data().ID
					
					// Получаем дополнительные данные о пользователе
					BX24.callMethod('user.get', { 'ID': currentUserId }, function(userResult) {
						if (userResult.error()) {
							console.error('Ошибка при получении данных пользователя:', userResult.error())
						} else {
							const userData = userResult.data()[0]
							const currentUser = `${userData.NAME} ${userData.LAST_NAME}`
							
							// Создаем объект нового расхода
							const newExpense = {
								IBLOCK_TYPE_ID: 'lists',
								IBLOCK_ID: listId,
								ELEMENT_CODE: `expense_${Date.now()}`,
								FIELDS: {
									NAME: expense.purpose,
									PROPERTY_125: expense.type,
									PROPERTY_113: formatDate(expense.plannedDate),
									PROPERTY_117: expense.amount,
									PROPERTY_127: currentUser,
									PROPERTY_129: dealId
								}
							}
							
							// Если указана фактическая дата, добавляем ее в объект расхода
							if (expense.actualDate) {
								newExpense.FIELDS.PROPERTY_115 = formatDate(expense.actualDate)
							}
							
							// Добавляем новый расход в список
							BX24.callMethod('lists.element.add', newExpense, function(result) {
								if (result.error()) {
									console.error('Ошибка при добавлении расхода:', result.error())
								} else {
									if (result.data()) {
										fetchExpenses() // Обновляем список расходов
										handleClose() // Закрываем модальное окно
										window.location.reload() // Обновляем страницу
									}
								}
							});
						}
					});
				}
			});
		} catch (error) {
			console.error('Произошла ошибка при добавлении расхода:', error);
		}
	}, [dealId, fetchExpenses, handleClose]);
	
	const formatDate = (date) => {
		if (!date) return ''
		const formattedDate = new Date(date)
		return formattedDate.toISOString()
	}
	
	return (
		<div className='container'>
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
	)
}

export default Expenses
