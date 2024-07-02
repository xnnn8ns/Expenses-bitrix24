import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const ExpenseForm = ({ addExpense, dealId }) => {
	const [type, setType] = useState('')
	const [purpose, setPurpose] = useState('')
	const [plannedDate, setPlannedDate] = useState('')
	const [actualDate, setActualDate] = useState('')
	const [amount, setAmount] = useState('')
	
	const handleSubmit = (e) => {
		e.preventDefault()
		addExpense({
			type,
			purpose,
			plannedDate,
			actualDate,
			amount,
			dealId
		})
	}
	
	return (
		<Form onSubmit={handleSubmit}>
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
			
			<Form.Group className='mb-2' controlId='purpose'>
				<Form.Label>Назначение платежа</Form.Label>
				<Form.Control
					type='text'
					value={purpose}
					onChange={(e) => setPurpose(e.target.value)}
					required
				/>
			</Form.Group>
			
			<Form.Group className='mb-2' controlId='plannedDate'>
				<Form.Label>Планируемая дата оплаты</Form.Label>
				<Form.Control
					type='datetime-local'
					value={plannedDate}
					onChange={(e) => setPlannedDate(e.target.value)}
					required
				/>
			</Form.Group>
			
			<Form.Group className='mb-2' controlId='actualDate'>
				<Form.Label>Фактическая дата оплаты</Form.Label>
				<Form.Control
					type='datetime-local'
					value={actualDate}
					onChange={(e) => setActualDate(e.target.value)}
				/>
			</Form.Group>
			
			<Form.Group className='mb-4' controlId='amount'>
				<Form.Label>Сумма расхода</Form.Label>
				<Form.Control
					type='number'
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					required
				/>
			</Form.Group>
			
			<Button variant='primary' type='submit'>
				Добавить расход
			</Button>
		</Form>
	)
}

export default ExpenseForm
