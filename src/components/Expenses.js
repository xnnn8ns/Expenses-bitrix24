import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ExpenseForm from './ExpenseForm';
import ExpenseTable from './ExpenseTable';

// Основной компонент для управления расходами
const Expenses = () => {
  // Состояния для хранения данных о расходах, управления модальным окном и маржи сделки
  const [expenses, setExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [dealMargin, setDealMargin] = useState(0);
  // Используется для принудительного обновления компонента
  const [forceUpdate, setForceUpdate] = useState(false);

  // Конфигурация для запросов к API
  const webhookUrl = 'https://b24-9zmx9g.bitrix24.ru/rest/1/iu0e2vslb0030jdz';
  const listId = '31';

  // Загрузка данных о расходах при монтировании компонента
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${webhookUrl}/lists.element.get`, {
          params: {
            IBLOCK_TYPE_ID: 'lists',
            IBLOCK_ID: listId
          }
        });

        console.log('Полученные данные:', response.data);
        if (response.data.result) {
          setExpenses(response.data.result);
        } else {
          console.error('Ошибка при загрузке расходов:', response.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке расходов:', error);
      }
    };

    fetchExpenses();
  }, [webhookUrl, listId, forceUpdate]);

  // Функции для управления состоянием модального окна
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Функция для добавления нового расхода
  const addExpense = async (expense) => {
    try {
      const currentUser = '123456'; // Заглушка для идентификатора пользователя

      const newExpense = {
        IBLOCK_TYPE_ID: 'lists',
        IBLOCK_ID: listId,
        ELEMENT_CODE: `expense_${Date.now()}`, // Уникальный код элемента
        FIELDS: {
          NAME: expense.purpose,
          PROPERTY_125: expense.type,
          PROPERTY_113: formatDate(expense.plannedDate),
          PROPERTY_117: expense.amount,
          PROPERTY_127: currentUser,
          PROPERTY_129: expense.dealLink
        }
      };

      if (expense.actualDate) {
        newExpense.FIELDS.PROPERTY_115 = formatDate(expense.actualDate);
      }

      console.log('Отправляемый новый расход:', newExpense);

      const response = await axios.post(`${webhookUrl}/lists.element.add`, newExpense);
      console.log('Ответ после добавления расхода:', response.data);

      if (response.data.result) {
        const updatedExpenses = [...expenses, { ...newExpense.FIELDS, ID: response.data.result }];
        setExpenses(updatedExpenses);
        setForceUpdate(prev => !prev); // Обновление состояния для перерисовки компонента
        handleClose();
      } else {
        console.error('Ошибка при добавлении расхода:', response.data);
      }
    } catch (error) {
      console.error('Ошибка при добавлении расхода:', error.response ? error.response.data : error);
    }
  };

  // Функция для форматирования даты в формат ISO
  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    return formattedDate.toISOString();
  };

  return (
    <div className="container">
      <h1>Расходы по сделкам</h1>
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        Добавить расход
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить расход</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExpenseForm addExpense={addExpense} />
        </Modal.Body>
      </Modal>

      <ExpenseTable expenses={expenses} dealMargin={dealMargin} forceUpdate={forceUpdate} />
    </div>
  );
};

export default Expenses;