const VIDEOS = {
    neutral: 'neutral.mp4',
    smiling: 'smiling.mp4',
    frowning: 'frowning.mp4'
};

let gameState = { 
    step: 1, 
    score: 50, 
    lastChoiceScore: 0,
    randomEventTriggered: false 
};

const randomEvents = [
    {
        text: ' Wait, секунду! Давай проверим твою выдержку. Представь: мы гуляем, и я прошу тебя пофоткать меня. Сделать примерно 150 кадров, пока не поймаю идеальный свет. Твоя реакция? 📸',
        options: [
            { text: '«Ну, 150 — это перебор. Давай я сделаю 10, но очень крутых, а остальное время пообщаемся.»', scoreChange: 10 },
            { text: '«Без проблем! Подскажу удачные ракурсы, настрою свет и подержу сумочку. Будет пожар!»', scoreChange: 25 },
            { text: '«Ужас какой. Ненавижу это Инстаграм-рабство. Давай без этого обойдемся.»', scoreChange: -15 },
            { text: '«Ладно, пофоткаю, мне не сложно. Главное, чтобы ты улыбалась.»', scoreChange: 0 },
            { text: '«Я тебе не личный раб с камерой. Знай меру, у меня тоже есть гордость.»', scoreChange: -30 }
        ]
    }
];

const script = {
    1: {
        text: 'Так, стоп... Твое лицо кажется мне дико знакомым. Ты случайно не тот парень, который на прошлой неделе уронил телефон в бассейн на вечеринке у блогеров? Или ты просто мастерски маскируешься? 🕵️‍♀️',
        options: [
            { text: '«Черт, меня раскрыли! Но в бассейн я прыгал ради спасения котика, честно.»', scoreChange: 25, nextStep: 2 },
            { text: '«Вы ошиблись, я серьезный человек и по бассейнам в одежде не прыгаю.»', scoreChange: -15, nextStep: 2 },
            { text: '«Нет, вы ошиблись. Я на такие мероприятия обычно не хожу.»', scoreChange: 0, nextStep: 2 },
            { text: '«Возможно. Я вообще люблю устраивать шоу там, где все слишком серьезные.»', scoreChange: 10, nextStep: 2 },
            { text: '«Меньше надо по тусовкам ходить, тогда и лица путаться не будут.»', scoreChange: -30, nextStep: 2 }
        ]
    },
    2: {
        textSuccess: 'Ахаха, отличный заезд! 😹 Котик спасен, репутация восстановлена. Ладно, юмор я ценю. Скажи, а ты всегда такой спонтанный или это был разовый демо-режим для привлечения внимания?',
        textFail: 'Ой-ой, повеяло душными лекциями... *Алиса закатила глаза*. Ладно, давай заново. Без пафоса. Какое у тебя самое безумное или странное воспоминание за этот год?',
        options: [
            { text: '«Проспал важное собеседование, потому что всю ночь спасал бездомного пса.»', scoreChange: 10, nextStep: 3 },
            { text: '«Безумие — это удел подростков. Разумный человек просчитывает каждый шаг.»', scoreChange: -30, nextStep: 3 },
            { text: '«Да ничего особенного, живу обычной размеренной жизнью работа-дом.»', scoreChange: 0, nextStep: 3 },
            { text: '«Сорвался в трип в другой город с одним рюкзаком, потому что зацепил трек в наушниках.»', scoreChange: 25, nextStep: 3 },
            { text: '«Купил акции на бирже. Инвестиции — это самый правильный и взрослый экстрим.»', scoreChange: -15, nextStep: 3 }
        ]
    },
    3: {
        textSuccess: 'Обожаю! Спонтанные поездки — это лучший антидепрессант. Лови интригу: у меня в сторис сейчас висит скрытый намек на мое настроение. Угадаешь по музыке, что со мной не так? 🎧',
        textFail: 'Инвестиции... Ты звучишь как мой бухгалтер. 🙄 Ладно, давай сменим тему. Ты вообще умеешь читать между строк? Что по-твоему девчонки чаще всего скрывают за идеальными сторис?',
        options: [
            { text: '«Женская логика — загадка. По-моему, вы сами не знаете, зачем это постите.»', scoreChange: -30, nextStep: 4 },
            { text: '«Да вы просто просмотры и охваты так себе поднимаете, классический байт.»', scoreChange: -15, nextStep: 4 },
            { text: '«За грустным треком обычно скрывается желание, чтобы тот самый человек просто написал.»', scoreChange: 25, nextStep: 4 },
            { text: '«Наверное, какую-то личную драму, о которой не хочется говорить вслух.»', scoreChange: 0, nextStep: 4 },
            { text: '«Вы скрываете усталость от бесконечной гонки за лайками и фальшивыми улыбками.»', scoreChange: 10, nextStep: 4 }
        ]
    },
    4: {
        textSuccess: 'Ого... А ты чертовски проницателен. Попал в точку. Аж мурашки... Ладно, проверим тебя на прочность. Представь, что я капризная Инста-дива с кучей запросов. Чем будешь меня удивлять?',
        textFail: 'Ну вот, взял и разрушил всю интригу своим цинизмом. *Алиса обиделась*. Ладно, прагматик, перейдем к делу: как ты вообще планируешь производить впечатление на девушку?',
        options: [
            { text: '«Искренним разговором по душам, хорошей шуткой и полным отсутствием масок.»', scoreChange: 10, nextStep: 5 },
            { text: '«А зачем мне тебя удивлять? Девушка должна любить мужчину за его статус, а не за фокусы.»', scoreChange: -30, nextStep: 5 },
            { text: '«Приглашу в хорошее проверенное место, закажу твои любимые блюда.»', scoreChange: 0, nextStep: 5 },
            { text: '«Никаких банальных роз. Подарю тебе эмоцию и локацию, которую ты еще не видела.»', scoreChange: 25, nextStep: 5 },
            { text: '«Покажу тебе свой инвестиционный портфель и отвезу в закрытый клуб.»', scoreChange: -15, nextStep: 5 }
        ]
    }
};

const scriptEnd = {
    5: {
        textSuccess: 'Звучит как вызов... И мне это чертовски нравится! 😉 Игру в психологию ты прошел. Переходим к конкретике: где будет проходить наше секретное свидание?',
        textFail: 'Портфель? Статус? Ты думаешь, меня можно купить? Чванство чистой воды. Ладно, давай проверим твой вкус: куда ты меня зовешь?',
        options: [
            { text: '«Поедим шаурмы на углу, проверим тебя на простоту и отсутствие короны.»', scoreChange: -30, nextStep: 6 },
            { text: '«В пафосный ресторан с золотыми ложками и строгим бронированием за месяц.»', scoreChange: -15, nextStep: 6 },
            { text: '«Секретный спикизи-бар за неприметной дверью, с крутым джазом и неоном для твоих сторис.»', scoreChange: 25, nextStep: 6 },
            { text: '«В уютный летний кинотеатр под открытым небом, смотреть старую комедию с попкорном.»', scoreChange: 10, nextStep: 6 },
            { text: '«В хороший итальянский ресторан в центре города. Паста, вино, классика.»', scoreChange: 0, nextStep: 6 }
        ]
    },
    6: {
        textSuccess: 'Спикизи-бар? Неон и джаз? Ооо, у тебя определенно есть стиль! Ну ладно, интриган. А на каком транспорте мы туда ворвемся?',
        textFail: 'Золотые ложки или шаурма ради проверки? Какой-то крах крайностей... Ладно, допустим. Как добираться-то будем до места?',
        options: [
            { text: '«Заеду за тобой на каршеринге, откроем люк, включим твой любимый плейлист на максимум.»', scoreChange: 25, nextStep: 7 },
            { text: '«Вызову комфортное такси, чтобы ты могла расслабиться и не думать о дороге.»', scoreChange: 10, nextStep: 7 },
            { text: '«Встретимся прямо у входа в заведение, так будет удобнее обоим.»', scoreChange: 0, nextStep: 7 },
            { text: '«Пришлю за тобой VIP-лимузин с караоке, чтобы все соседи обзавидовались.»', scoreChange: -15, nextStep: 7 },
            { text: '«Пройдемся пешком пару километров через парк. Движение — жизнь, полезно для здоровья.»', scoreChange: -30, nextStep: 7 }
        ]
    },
    7: {
        textSuccess: 'Ночной город, музыка на полную — идеальный вайб! Ну и финальный штрих перед вердиктом: мне надевать то самое черное платье, от которого все сходят с ума? 😏 Что наденешь сам?',
        textFail: 'Лимузин или пеший марафон в грозу? Извини, но это мимо... Ладно, последний вопрос перед тем, как я приму решение: в каком луке ты придешь?',
        options: [
            { text: '«Я надену классические джинсы и рубашку. Простой, аккуратный стиль.»', scoreChange: 0, nextStep: 'final' },
            { text: '«Приходи в чем тебе максимально комфортно, хоть в худи. Я подстроюсь под твой стиль.»', scoreChange: 10, nextStep: 'final' },
            { text: '«Надевай платье, а я буду в стильном кэжуал-костюме и кроссах — сделаем идеальный контраст для фото.»', scoreChange: 25, nextStep: 'final' },
            { text: '«Я приду в строгом классическом смокинге с бабочкой. Мы должны выглядеть на миллион.»', scoreChange: -15, nextStep: 'final' },
            { text: '«Приходи поскромнее, не люблю когда на мою девушку все пялятся. А я буду в удобных спортивках.»', scoreChange: -30, nextStep: 'final' }
        ]
    }
};

Object.assign(script, scriptEnd);

function changeVideoSrc(newSrc) {
    const video = document.getElementById('alice-video');
    if (video && !video.src.endsWith(newSrc)) {
        video.src = newSrc;
        video.play().catch(e => console.log("Ожидание клика пользователя"));
    }
}

function updateUI() {
    const scoreVal = document.getElementById('score-value');
    const progressFill = document.getElementById('progress-fill');
    const dialogText = document.getElementById('dialog-text');
    const optionsContainer = document.getElementById('options-container');

    if (gameState.score > 100) gameState.score = 100;
    if (gameState.score < 0) gameState.score = 0;

    scoreVal.innerText = gameState.score;
    progressFill.style.width = gameState.score + '%';
    optionsContainer.innerHTML = '';

    if (gameState.step === 4 && !gameState.randomEventTriggered) {
        gameState.randomEventTriggered = true;
        const randomIndex = Math.floor(Math.random() * randomEvents.length);
        const event = randomEvents[randomIndex];

        dialogText.innerText = `🚨 ВНЕЗАПНЫЙ ПОВОРОТ СЮЖЕТА! 🚨\n${event.text}`;
        changeVideoSrc(VIDEOS.neutral);

        event.options.forEach(opt => {
            let btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.innerText = opt.text;
            btn.onclick = () => {
                gameState.score += opt.scoreChange;
                gameState.lastChoiceScore = opt.scoreChange;
                gameState.step = 4; 
                updateUI();
            };
            optionsContainer.appendChild(btn);
        });
        return;
    }

    if (gameState.step === 'final') {
        if (gameState.score >= 85) {
            dialogText.innerText = `🔥 ПОЛНЫЙ ТРИУМФ! Шансы: ${gameState.score}%. Алиса в восторге: «Ты просто нереальный! Умный, тонкий, с потрясающей самоиронией и абсолютно без пафоса. Твой план с баром и музыкой в машине — пушка. Я побежала надевать то самое платье, скидывай адрес, жду вечер!» 🥂✨`;
            changeVideoSrc(VIDEOS.smiling);
        } else if (gameState.score >= 50 && gameState.score < 85) {
            dialogText.innerText = ` 🤔 ШАНС ЕСТЬ. Шансы: ${gameState.score}%. Алиса кокетничает: «Ладно, загадочный мистер. Местами ты, конечно, занудствовал или пытался казаться слишком правильным, но интригу держать умеешь. Давай попробуем поужинать. Но учти: начнешь душнить — сбегу!»`;
            changeVideoSrc(VIDEOS.neutral);
        } else {
            dialogText.innerText = `❌ ПОЛНЫЙ ОТКАЗ. Шансы: ${gameState.score}%. Алиса разочарована: «Не, чувак, интрига умерла, не успев родиться. Ты слишком зациклен на понтах, правилах или, наоборот, включаешь жесткого критика. Ханжество и душнота — это комбо. Я лучше останусь дома. Пока!»`;
            changeVideoSrc(VIDEOS.frowning);
        }
        
        let restartBtn = document.createElement('button');
        restartBtn.className = 'btn-option';
        restartBtn.innerText = 'Попробовать еще раз 🔄';
        restartBtn.onclick = () => {
            gameState = { step: 1, score: 50, lastChoiceScore: 0, randomEventTriggered: false };
            updateUI();
        };
        optionsContainer.appendChild(restartBtn);
        return;
    }

    const currentStepData = script[gameState.step];
    
    if (gameState.step === 1) {
        dialogText.innerText = currentStepData.text;
        changeVideoSrc(VIDEOS.neutral);
    } else {
        if (gameState.lastChoiceScore >= 10) {
            dialogText.innerText = currentStepData.textSuccess;
            changeVideoSrc(VIDEOS.smiling);
        } else {
            dialogText.innerText = currentStepData.textFail;
            changeVideoSrc(VIDEOS.frowning);
        }
    }

    currentStepData.options.forEach(opt => {
        let btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = opt.text;
        btn.onclick = () => {
            gameState.score += opt.scoreChange;
            gameState.lastChoiceScore = opt.scoreChange;
            gameState.step = opt.nextStep;
            updateUI();
        };
        optionsContainer.appendChild(btn);
    });
}

window.onload = updateUI;
