/* global BX24 */
import React, { useCallback, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'

const ExpenseTable = ({ expenses, dealMargin }) => {
    const [users, setUsers] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [groupedExpenses, setGroupedExpenses] = useState({});
    
    const fetchUser = useCallback((userId) => {
        if (userId && !users[userId]) {
            BX24.callMethod('user.get', { 'ID': userId }, (result) => {
                if (result.error()) {
                    console.error('Ошибка при получении данных пользователя:', result.error());
                } else {
                    const userData = result.data()[0];
                    setUsers((prevUsers) => ({
                        ...prevUsers,
                        [userId]: userData,
                    }));
                }
            });
        }
    }, [users]);
    
    useEffect(() => {
        const newTotalAmount = expenses.reduce((sum, expense) => {
            const amount = expense.PROPERTY_117 ? parseFloat(expense.PROPERTY_117[Object.keys(expense.PROPERTY_117)[0]]) : 0;
            return sum + amount;
        }, 0);
        setTotalAmount(newTotalAmount);
        
        const newGroupedExpenses = expenses.reduce((acc, expense) => {
            const type = expense.PROPERTY_125 ? expense.PROPERTY_125[Object.keys(expense.PROPERTY_125)[0]] : 'Неизвестный тип';
            const amount = expense.PROPERTY_117 ? parseFloat(expense.PROPERTY_117[Object.keys(expense.PROPERTY_117)[0]]) : 0;
            acc[type] = (acc[type] || 0) + amount;
            return acc;
        }, {});
        setGroupedExpenses(newGroupedExpenses);
        
        expenses.forEach((expense) => {
            const userId = expense.PROPERTY_131 ? expense.PROPERTY_131[Object.keys(expense.PROPERTY_131)[0]] : null;
            if (userId) {
                fetchUser(userId);
            }
        });
    }, [expenses, fetchUser]);
    
    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Тип расхода</th>
                    <th>Назначение платежа</th>
                    <th>Планируемая дата</th>
                    <th>Фактическая дата</th>
                    <th>Сумма расхода</th>
                    <th>Ответственный</th>
                </tr>
                </thead>
                <tbody>
                {expenses.map((expense) => {
                    const userId = expense.PROPERTY_131 ? expense.PROPERTY_131[Object.keys(expense.PROPERTY_131)[0]] : null;
                    const user = userId ? users[userId] : null;
                    return (
                        <tr key={expense.ID}>
                            <td>{expense.PROPERTY_125 ? expense.PROPERTY_125[Object.keys(expense.PROPERTY_125)[0]] : '—'}</td>
                            <td>{expense.NAME ? expense.NAME : '—'}</td>
                            <td>{expense.PROPERTY_113 ? expense.PROPERTY_113[Object.keys(expense.PROPERTY_113)[0]] : '—'}</td>
                            <td>{expense.PROPERTY_115 ? expense.PROPERTY_115[Object.keys(expense.PROPERTY_115)[0]] : '—'}</td>
                            <td>{expense.PROPERTY_117 ? expense.PROPERTY_117[Object.keys(expense.PROPERTY_117)[0]] : '—'}</td>
                            <td>{user ? `${user.NAME} ${user.LAST_NAME}` : 'Загрузка...'}</td>
                        </tr>
                    );
                })}
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
    );
};

export default ExpenseTable;
