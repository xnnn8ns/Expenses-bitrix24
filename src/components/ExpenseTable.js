import React, { useMemo } from 'react'
import { Table } from 'react-bootstrap'

const ExpenseTable = ({ expenses, dealMargin }) => {
    const totalAmount = useMemo(() => expenses.reduce((acc, expense) => {
        const amount = parseFloat(expense.PROPERTY_117 ? Object.values(expense.PROPERTY_117)[0] : 0)
        return acc + (isNaN(amount) ? 0 : amount)
    }, 0), [expenses]);

    const groupedExpenses = useMemo(() => expenses.reduce((acc, expense) => {
        const type = Object.values(expense.PROPERTY_125)[0]
        const amount = parseFloat(expense.PROPERTY_117 ? Object.values(expense.PROPERTY_117)[0] : 0)
        if (!acc[type]) {
            acc[type] = 0
        }
        acc[type] += isNaN(amount) ? 0 : amount
        return acc
    }, {}), [expenses]);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Тип расхода</th>
                    <th>Название</th>
                    <th>Планируемая дата оплаты</th>
                    <th>Фактическая дата оплаты</th>
                    <th>Сумма расхода</th>
                    <th>Ответственный</th>
                </tr>
                </thead>
                <tbody>
                {expenses.map((expense, index) => (
                    <tr key={expense.id || index}>
                        <td>{Object.values(expense.PROPERTY_125)[0]}</td>
                        <td>{expense.NAME || '—'}</td>
                        <td>{Object.values(expense.PROPERTY_113)[0]}</td>
                        <td>{Object.values(expense.PROPERTY_115)[0]}</td>
                        <td>{Object.values(expense.PROPERTY_117)[0]}</td>
                        <td>{Object.values(expense.PROPERTY_127)[0]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <h4>Итого сумма расходов равна {totalAmount}</h4>
            <ul>
                {Object.entries(groupedExpenses).map(([type, sum]) => (
                    <li key={type}>
                        Группировка расходов по типу {type} - Сумма {sum}
                    </li>
                ))}
            </ul>
            <h4>Маржинальность сделки - {dealMargin}%</h4>
        </>
    )
}

export default ExpenseTable