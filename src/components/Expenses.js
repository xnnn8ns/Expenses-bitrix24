/* global BX24 */
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
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
  const listId = '31';

  // Загрузка данных о расходах при монтировании компонента
  useEffect(() => {
    BX24.init(() => {
      console.log("BX24 is ready", BX24.isAdmin());

      const auth = BX24.getAuth();
      if (auth) {
        const fetchExpenses = async () => {
          try {
            BX24.callMethod('lists.element.get', {
              IBLOCK_TYPE_ID: 'lists',
              IBLOCK_ID: listId,
              auth: auth.access_token
            }, function(result) {
              if(result.error()) {
                console.error('Ошибка при загрузке расходов:', result.error());
              } else {
                console.log('Полученные данные:', result.data());
                if (result.data()) {
                  setExpenses(result.data());
                }
              }
            });
          } catch (error) {
            console.error('Ошибка при загрузке расходов:', error);
          }
        };

        fetchExpenses();
      } else {
        console.error('Ошибка при получении токена доступа');
      }
    });
  }, [listId, forceUpdate]);

  // Функции для управления состоянием модального окна
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Функция для добавления нового расхода
  const addExpense = async (expense) => {
    try {
      BX24.callMethod('user.current', {}, function(result) {
        if(result.error()) {
          console.error('Ошибка при получении текущего пользователя:', result.error());
        } else {
          const currentUserId = result.data().ID;

          BX24.callMethod('user.get', { 'ID': currentUserId }, function(userResult) {
            if(userResult.error()) {
              console.error('Ошибка при получении данных пользователя:', userResult.error());
            } else {
              console.log('Полученные данные пользователя:', userResult.data());

              // Выбираем первый элемент массива
              const userData = userResult.data()[0];

              const currentUser = `${userData.NAME} ${userData.LAST_NAME}`;

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

              BX24.callMethod('lists.element.add', newExpense, function(result) {
                if(result.error()) {
                  console.error('Ошибка при добавлении расхода:', result.error());
                } else {
                  console.log('Ответ после добавления расхода:', result.data());
                  if (result.data()) {
                    const updatedExpenses = [...expenses, { ...newExpense.FIELDS, ID: result.data() }];
                    setExpenses(updatedExpenses);
                    setForceUpdate(prev => !prev); // Обновление состояния для перерисовки компонента
                    handleClose();
                  }
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Ошибка при добавлении расхода:', error);
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