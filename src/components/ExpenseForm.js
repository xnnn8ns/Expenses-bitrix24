import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

// Компонент формы для добавления нового расхода
const ExpenseForm = ({ addExpense }) => {
	// Состояния для каждого поля формы
	const [type, setType] = useState('')
	const [purpose, setPurpose] = useState('')
	const [plannedDate, setPlannedDate] = useState('')
	const [actualDate, setActualDate] = useState('')
	const [amount, setAmount] = useState('')
	const [dealLink, setDealLink] = useState('')
	
	// Обработчик отправки формы
	const handleSubmit = (e) => {
		e.preventDefault() // Предотвращение стандартного поведения формы
		// Вызов функции addExpense из родительского компонента с данными формы
		addExpense({
			type,
			purpose,
			plannedDate,
			actualDate,
			amount,
			dealLink
		})
	}
	
	return (
		<Form onSubmit={handleSubmit}>
			{/* Выбор типа расхода */}
			<Form.Group className='mb-2' controlId='type'>
				<Form.Label>Тип расхода</Form.Label>
				<Form.Control
					as='select'
					value={type}
					onChange={(e) => setType(e.target.value)}
					required
				>
					<option value=''>Выберите тип расхода</option>
					<option value='1'>Тип 1</option>
					<option value='2'>Тип 2</option>
				</Form.Control>
			</Form.Group>
			
			{/* Ввод назначения платежа */}
			<Form.Group className='mb-2' controlId='purpose'>
				<Form.Label>Назначение платежа</Form.Label>
				<Form.Control
					type='text'
					value={purpose}
					onChange={(e) => setPurpose(e.target.value)}
					required
				/>
			</Form.Group>
			
			{/* Выбор планируемой даты оплаты */}
			<Form.Group className='mb-2' controlId='plannedDate'>
				<Form.Label>Планируемая дата оплаты</Form.Label>
				<Form.Control
					type='datetime-local'
					value={plannedDate}
					onChange={(e) => setPlannedDate(e.target.value)}
					required
				/>
			</Form.Group>
			
			{/* Выбор фактической даты оплаты */}
			<Form.Group className='mb-2' controlId='actualDate'>
				<Form.Label>Фактическая дата оплаты</Form.Label>
				<Form.Control
					type='datetime-local'
					value={actualDate}
					onChange={(e) => setActualDate(e.target.value)}
				/>
			</Form.Group>
			
			{/* Ввод суммы расхода */}
			<Form.Group className='mb-2' controlId='amount'>
				<Form.Label>Сумма расхода</Form.Label>
				<Form.Control
					type='number'
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					required
				/>
			</Form.Group>
			
			{/* Ввод ссылки на сделку */}
			<Form.Group className='mb-3' controlId='dealLink'>
				<Form.Label>Ссылка на сделку</Form.Label>
				<Form.Control
					type='text'
					value={dealLink}
					onChange={(e) => setDealLink(e.target.value)}
				/>
			</Form.Group>
			
			{/* Кнопка для добавления расхода */}
			<Button variant='primary' type='submit'>
				Добавить расход
			</Button>
		</Form>
	)
}

export default ExpenseForm