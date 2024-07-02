/* global BX24 */
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import ExpenseForm from './ExpenseForm'
import ExpenseTable from './ExpenseTable'

const Expenses = () => {
	const [expenses, setExpenses] = useState([])
	const [show, setShow] = useState(false)
	const [dealMargin, setDealMargin] = useState(0)
	const [dealId, setDealId] = useState(null)
	const [forceUpdate, setForceUpdate] = useState(false)
	const listId = '31'
	
	useEffect(() => {
		BX24.init(() => {
			console.log('BX24 is ready', BX24.isAdmin())
			
			const auth = BX24.getAuth()
			if (auth) {
				const fetchExpenses = async () => {
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
				}
				
				fetchExpenses()
			} else {
				console.error('Ошибка при получении токена доступа')
			}
			
			const placementInfo = BX24.placement.info()
			if (placementInfo && placementInfo.options && placementInfo.options.ID) {
				setDealId(placementInfo.options.ID)
			} else {
				console.error('Не удалось получить ID сделки')
			}
		})
	}, [listId, forceUpdate]) // Добавлено forceUpdate как зависимость
	
	useEffect(() => {
		if (dealId && expenses.length > 0) {
			const filtered = expenses.filter(expense => {
				const expenseDealId = Object.values(expense.PROPERTY_129)[0]
				return expenseDealId && expenseDealId === dealId
			})
			setExpenses(filtered)
		}
	}, [dealId, expenses])
	
	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)
	
	const addExpense = async (expense) => {
		try {
			BX24.callMethod('user.current', {}, function(result) {
				if (result.error()) {
					console.error('Ошибка при получении текущего пользователя:', result.error())
				} else {
					const currentUserId = result.data().ID
					
					BX24.callMethod('user.get', { 'ID': currentUserId }, function(userResult) {
						if (userResult.error()) {
							console.error('Ошибка при получении данных пользователя:', userResult.error())
						} else {
							const userData = userResult.data()[0]
							const currentUser = `${userData.NAME} ${userData.LAST_NAME}`
							
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
							
							if (expense.actualDate) {
								newExpense.FIELDS.PROPERTY_115 = formatDate(expense.actualDate)
							}
							
							BX24.callMethod('lists.element.add', newExpense, function(result) {
								if (result.error()) {
									console.error('Ошибка при добавлении расхода:', result.error())
								} else {
									if (result.data()) {
										setForceUpdate(prev => !prev) // Изменение состояния для принудительного обновления
										handleClose()
									}
								}
							})
						}
					})
				}
			})
		} catch (error) {
			console.error('Ошибка при добавлении расхода:', error)
		}
	}
	
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
