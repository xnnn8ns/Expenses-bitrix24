import React from 'react';
import { Table } from 'react-bootstrap';

// Компонент для отображения таблицы расходов
const ExpenseTable = ({ expenses, dealMargin }) => {

  // Вычисляем общую сумму расходов
  const totalAmount = expenses.reduce((acc, expense) => {
    // Преобразование значения суммы расхода в число
    const amount = parseFloat(expense.PROPERTY_117 ? Object.values(expense.PROPERTY_117)[0] : 0);
    return acc + (isNaN(amount) ? 0 : amount); // Игнорирование невалидных значений
  }, 0);

  // Группируем расходы по типу (PROPERTY_125) (тип расхода)
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const type = Object.values(expense.PROPERTY_125)[0]; // Получение типа расхода
    if (!acc[type]) {
      acc[type] = 0; // Инициализация счетчика для нового типа расхода
    }
    acc[type] += parseFloat(Object.values(expense.PROPERTY_117)[0]); // Добавление суммы по типу
    return acc;
  }, {});

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
            <tr key={index}>
              <td>{Object.values(expense.PROPERTY_125)[0]}</td> {/* Тип расхода */}
              <td>{expense.NAME ? expense.NAME : '—'}</td> {/* Название расхода */}
              <td>{Object.values(expense.PROPERTY_113)[0]}</td> {/* Планируемая дата оплаты */}
              <td>{Object.values(expense.PROPERTY_115)[0]}</td> {/* Фактическая дата оплаты */}
              <td>{Object.values(expense.PROPERTY_117)[0]}</td> {/* Сумма расхода */}
              <td>{Object.values(expense.PROPERTY_127)[0]}</td> {/* Ответственный */}
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
  );
};

export default ExpenseTable;