Необходимо реализовать форму для отправки средств от одного пользователя к другому:

- Форма содержит 4 поля (`currency`, from, amount, `to`) и кнопку для проведения трансфера
- Если пользователь выбран в from, то в to он отображаться не должен
- Поля from и to фильтруются в зависимости от выбранного значения в поле currency
- Значение в поле amount не может быть отрицательным и не может превышать баланс пользователя по конкретной валюте. Поле amount должно форматироваться и валидироваться по значению decimals валюты.
- Метод /transfers/make-transfer намеренно может ответить с кодом ответа 400 - необходимо обработать этот кейс и отобразить пользователю ошибку

Технические требования:

- Использовать React/Angular/Vue или ванильный JavaScript
- Использовать любой UI фреймворк или использовать чистый css/scss/less. Главное - чтобы выглядело гармонично и красиво.
- Пакетный менеджер yarn
- Приложение должно запускаться по адресу localhost:3000 командой yarn start

Api:

GET http://91.193.43.93:3000/currencies
Accept: application/json

Response:
[
{
"id": number,
"code": string,
"name": string
"decimals": number
}
]

GET http://91.193.43.93:3000/users
Accept: application/json

Response:
[
{
"id": number,
"name": string,
"currencies": {
"USD": string,
"EUR": string,
"GEL": string
}
}
]

POST http://91.193.43.93:3000/transfers/make-transfer
Content-Type: application/json

Request:
{
"currencyId": number,
"fromUserId": number,
"toUserId": number,
"amount": string
}

Response:
{
"transferId": string,
"amount": string
}
