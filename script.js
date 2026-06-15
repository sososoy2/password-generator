// xkcd単語リスト
let words = [];

// 使用する記号
const symbols = "!@#$%&";

fetch("./words.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error("単語リスト取得失敗");
        }
        return response.text();
    })
    .then(text => {

        words = [...new Set(
            text
                .split(/\r?\n/)
                .map(word =>
                    word.trim().toLowerCase()
                )
                .filter(word =>
                    word.length > 0
                )
        )];

        console.log(
            `Loaded ${words.length} words`
        );

        generatePassword();
    })
    .catch(error => {

        console.error(error);

        document.getElementById(
            "password"
        ).textContent =
            "単語リストの読み込みに失敗しました";
    });

function randomInt(max) {

    if (max <= 0) {
        return 0;
    }

    const array =
        new Uint32Array(1);

    crypto.getRandomValues(array);

    return array[0] % max;
}

// =========================
function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            randomInt(i + 1);

        [array[i], array[j]] =
        [array[j], array[i]];
    }
}

function randomNumber() {

    return String(
        randomInt(1000)
    );
}

function updateStrength(password) {

    let score = 0;

    score += password.length;

    if (/[A-Z]/.test(password))
        score += 10;

    if (/\d/.test(password))
        score += 10;

    if (
        /[!@#$%&]/.test(password)
    )
        score += 10;

    if (password.length > 30)
        score += 20;

    let text;

    if (score >= 70) {
        text = "強度: 非常に強い";
    }
    else if (score >= 50) {
        text = "強度: 強い";
    }
    else {
        text = "強度: 普通";
    }

    document.getElementById(
        "strength"
    ).textContent = text;
}

function generatePassword() {

    if (words.length === 0) {
        return;
    }

    const wordCount =
        parseInt(
            document.getElementById(
                "wordCount"
            ).value
        );

    const separator =
        document.getElementById(
            "separator"
        ).value;

    const useUppercase =
        document.getElementById(
            "useUppercase"
        ).checked;

    const useSymbols =
        document.getElementById(
            "useSymbols"
        ).checked;

    // 単語をコピー
    const pool = [...words];

    // シャッフル
    shuffle(pool);

    // 重複なし取得
    const selected =
        pool.slice(0, wordCount);

    // 数字を1～2個追加
    const numCount =
        randomInt(2) + 1;

    for (
        let i = 0;
        i < numCount;
        i++
    ) {

        const index =
            randomInt(
                selected.length + 1
            );

        selected.splice(
            index,
            0,
            randomNumber()
        );
    }

    // 記号を追加
    if (useSymbols) {

        const symbol =
            symbols[
                randomInt(
                    symbols.length
                )
            ];

        const index =
            randomInt(
                selected.length + 1
            );

        selected.splice(
            index,
            0,
            symbol
        );
    }

    // 大文字化
    if (useUppercase) {

        for (
            let i = 0;
            i < selected.length;
            i++
        ) {

            if (
                isNaN(selected[i]) &&
                selected[i].length > 1 &&
                randomInt(4) === 0
            ) {

                selected[i] =
                    selected[i][0]
                    .toUpperCase()
                    +
                    selected[i]
                    .slice(1);
            }
        }
    }

    // パスワード生成
    const password =
        selected.join(
            separator
        );

    document.getElementById(
        "password"
    ).textContent =
        password;

    // 強度更新
    updateStrength(password);

    // 文字数表示
    document.getElementById(
        "length"
    ).textContent =
        `文字数: ${password.length}文字`;

    // メッセージ消去
    document.getElementById(
        "message"
    ).textContent = "";
}

async function copyPassword() {

    const password =
        document.getElementById(
            "password"
        ).textContent;

    try {

        await navigator
            .clipboard
            .writeText(password);

        document.getElementById(
            "message"
        ).textContent =
            "✓ コピーしました";

        setTimeout(() => {

            document.getElementById(
                "message"
            ).textContent = "";

        }, 2000);

    } catch {

        document.getElementById(
            "message"
        ).textContent =
            "コピーに失敗しました";
    }
}

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const savedTheme =
    localStorage.getItem(
        "theme"
    );

if (savedTheme === "light") {

    document.body.classList
        .add("light-mode");

    themeToggle.checked = true;
}

themeToggle.addEventListener(
    "change",
    function () {

        if (this.checked) {

            document.body.classList
                .add("light-mode");

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            document.body.classList
                .remove("light-mode");

            localStorage.setItem(
                "theme",
                "dark"
            );
        }
    }
);