const TelegramApi = require('node-telegram-bot-api');
const token = "5681203382:AAFQaSSiFtgeTfYO_WwXuvrf66hMxIBScQI";
const bot = new TelegramApi(token, {polling: true});
const {gameOptions, againOptions} = require('./options');

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command : '/info', description: 'Получить информацию о пользователе.'},
        {command : '/game', description: 'Игра угадай число.'}
    ]);


    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text == "/game") {
            return startGame(chatId);
        }
        if(text == "/info"){
           return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} ${msg.from.last_name}`);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю!');
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === "/again"){
            return startGame(chatId);
        }
        if(data == chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру: ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению, ты не отгадал цифру, бот загадал: ${chats[chatId]}`, againOptions);
        }
    })
}

start();