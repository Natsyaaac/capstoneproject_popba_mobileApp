/**
* @fileOverview JavaScript Maths Function Library.
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 3.0.0
* @description Includes Story Mode integration for professional grade 1-6 questions
*              with proper sub-mode filtering for consistent question types
*/
/*jshint esversion: 6 */
/* globals getStoryQuestionArray, bpmDifficulty */

let useStoryMode = true;

/**
* [Function to return random question and answer array, given game mode, options and number of questions]
* @param  {[string]}    gameMode        [Game mode]
* @param  {[string]}    optionArray     [Array of active option button text value strings]
* @param  {[number]}    qno             [Number of questions]
* @return {[array]}                     [Question and answer array - an array of 2 item arrays giving question and answer]
*/
function returnQuestionArray(gameMode, optionArray, qno) {
    let questionArray = [];
    
    const storyModes = ['aljabar', 'time', 'heavy', 'volume', 'up', 'operator'];
    
    if (useStoryMode && storyModes.includes(gameMode) && typeof getStoryQuestionArray === 'function') {
        const difficulty = typeof bpmDifficulty !== 'undefined' ? bpmDifficulty : 'medium';
        const subMode = optionArray.length > 0 ? optionArray[0] : null;
        
        console.log(`🎮 Story Mode Request: gameMode=${gameMode}, subMode=${subMode}, difficulty=${difficulty}, qno=${qno}`);
        
        try {
            questionArray = getStoryQuestionArray(gameMode, difficulty, subMode, qno);
            
            if (questionArray && questionArray.length >= qno) {
                console.log(`✅ Story Mode: Generated ${questionArray.length} questions for ${gameMode} - ${subMode}`);
                return questionArray;
            } else {
                console.log(`⚠️ Story Mode: Only got ${questionArray ? questionArray.length : 0} questions, falling back to standard mode`);
            }
        } catch (error) {
            console.warn('Story Mode error, falling back to standard questions:', error);
        }
    }
    
    console.log(`📝 Using standard question generator for ${gameMode}`);
    
    if (gameMode == 'aljabar') {
        questionArray = returnAljabarQuestionArray(optionArray, qno);
    } else if (gameMode == 'time') {
        questionArray = returnTimeQuestionArray(optionArray, qno);
    } else if (gameMode == 'heavy') {
        questionArray = returnHeavyQuestionArray(optionArray, qno);
    } else if (gameMode == 'volume') {
        questionArray = returnVolumeQuestionArray(optionArray, qno);
    } else if (gameMode == 'up') {
        questionArray = returnUpQuestionArray(optionArray, qno);
    } else if (gameMode == 'operator') {
        questionArray = returnOperatorQuestionArray(optionArray, qno);
    } else if (gameMode == 'exam') {
        questionArray = returnExamQuestionArray(optionArray, qno);
    }
    return (questionArray);
}

function returnAljabarQuestionArray(optionArray, qno) {
    let ajqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            if (questionType == "Isi Kotak Kosong") {
                let a = Math.floor(Math.random() * 5) + 1;
                let b = Math.floor(Math.random() * 5) + a;
                question = `${a} + □ = ${b}`;
                answer = b - a;
            }

            else if (questionType == "Nilai Variabel") {
                let x = Math.floor(Math.random() * 5) + 1;
                let b = Math.floor(Math.random() * 5) + 1;
                let operator = Math.random() < 0.5 ? '+' : '-';

                if (operator === '+') {
                    question = `Jika x = ${x}, maka x + ${b} = ?`;
                    answer = x + b;
                } else {
                    question = `Jika x = ${x}, maka x - ${b} = ?`;
                    answer = x - b;
                }
            }

            else if (questionType == "Persamaan Sederhana") {
                let a = Math.floor(Math.random() * 5) + 1;
                let b = Math.floor(Math.random() * 5) + a;
                question = `x + ${a} = ${b}. Nilai x = ?`;
                answer = b - a;
            }

            else if (questionType == "Pola Bilangan") {
                let start = Math.floor(Math.random() * 3) + 1;
                let step = Math.floor(Math.random() * 3) + 1;
                let seq = `${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ...`;
                question = `bilangan berikut dari pola: ${seq}`;
                answer = start + 4 * step;
            }

            // batasi jumlah percobaan biar gak infinite loop
            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], ajqArray));

        ajqArray.push([question, answer]);
    }

    return ajqArray;
}

function returnTimeQuestionArray(optionArray, qno) {
    let tqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            /**
             * Soal mode Waktu — versi teks penuh (tanpa visual)
             */
            if (questionType == "Baca Jam") {
                // Soal membaca jam dari format 24 jam ke format 12 jam
                let hour24 = Math.floor(Math.random() * 24); // ambil jam acak 0–23
                let hour12 = hour24 % 12 || 12; // ubah ke jam 12 (kalau 0 jadi 12)

                // tampilkan soal
                question = `Kalau sekarang jam ${hour24.toString().padStart(2, '0')}.00 siang, itu jam berapa`;

                // jawabannya angka (misal: 2)
                answer = hour12;
            }

            else if (questionType == "Tambah & Kurang Waktu") {
                // Soal penjumlahan atau pengurangan waktu
                let startHour = Math.floor(Math.random() * 12) + 1; // jam awal (1–12)
                let change = Math.floor(Math.random() * 5) + 1; // perubahan jam (1–5)
                let isAdd = Math.random() < 0.5; // acak tambah atau kurang
                let timePeriod = Math.random() < 0.5 ? "pagi" : "siang"; // acak pagi/siang
                let result;

                if (isAdd) {
                    result = (startHour + change - 1) % 12 + 1;
                    question = `Sekarang pukul ${startHour} ${timePeriod}, kalau ditambah ${change} jam jadi jam berapa?`;
                } else {
                    result = (startHour - change + 12 - 1) % 12 + 1;
                    question = `Sekarang pukul ${startHour} ${timePeriod}, kalau dikurangi ${change} jam jadi jam berapa?`;
                }

                answer = result;
            }

            else if (questionType == "Konversi Waktu") {
                // Soal konversi antara jam, menit, dan detik
                const types = ["detik-ke-menit", "menit-ke-jam", "jam-ke-menit"];
                let type = types[Math.floor(Math.random() * types.length)];

                if (type === "detik-ke-menit") {
                    let detik = 60 * (Math.floor(Math.random() * 5) + 1); // kelipatan 60
                    answer = detik / 60;
                    question = `Jika ${detik} detik, itu berapa menit?`;
                }
                else if (type === "menit-ke-jam") {
                    let menit = 60 * (Math.floor(Math.random() * 3) + 1); // 60, 120, 180
                    answer = menit / 60;
                    question = `Jika ${menit} menit, itu berapa jam?`;
                }
                else if (type === "jam-ke-menit") {
                    let jam = Math.floor(Math.random() * 4) + 1; // 1–4 jam
                    answer = jam * 60;
                    question = `Kalau ${jam} jam itu berapa menit?`;
                }

            }


            else if (questionType == "Selisih Waktu") {
                // Soal menghitung durasi waktu
                let startHour = Math.floor(Math.random() * 12) + 1;
                let duration = Math.floor(Math.random() * 5) + 1;
                let endHour = (startHour + duration) % 12 || 12;
                question = `Sebuah acara dimulai pukul ${startHour} dan berakhir pukul ${endHour}. Berapa jam acara berlangsung?`;
                answer = duration;
            }


            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], tqArray));
        tqArray.push([question, answer]);
    }

    return tqArray;
}

function returnHeavyQuestionArray(optionArray, qno) {
    let hqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            if (questionType == "Konversi Berat") {
                const types = [
                    { soal: "gram-ke-kg", question: (x) => `${x} gram = ... kilogram`, answer: (x) => x / 1000 },
                    { soal: "ons-ke-gram", question: (x) => `${x} ons = ... gram`, answer: (x) => x * 100 },
                    { soal: "ons-ke-kg", question: (x) => `${x} ons = ... kilogram`, answer: (x) => x / 10 },
                    { soal: "kg-ke-gram", question: (x) => `${x} kilogram = ... gram`, answer: (x) => x * 1000 }
                ];

                // Pilih jenis soal secara acak
                const randomType = types[Math.floor(Math.random() * types.length)];

                // Angka acak kecil biar jawaban gak ribuan
                const value = Math.floor(Math.random() * 9) + 1; // 1–9

                // Buat soal dan jawaban
                question = randomType.question(value);
                answer = randomType.answer(value);
            }


            else if (questionType == "Tambah & Kurang Berat") {
                let base = Math.floor(Math.random() * 9) + 1;  // 1–9
                let change = Math.floor(Math.random() * 5) + 1; // 1–5
                let isAdd = Math.random() < 0.5;

                let result = isAdd ? base + change : base - change;
                if (result < 0) result = Math.abs(result); // jaga jangan negatif

                if (isAdd) {
                    question = `Berat benda ${base} kg, lalu ditambah ${change} kg. Jadi beratnya ... kg.`;
                } else {
                    question = `Berat benda ${base} kg, lalu dikurangi ${change} kg. Sekarang beratnya ... kg.`;
                }
                answer = result;
            }

            else if (questionType == "Bandingkan Berat") {
                let left = Math.floor(Math.random() * 9) + 1;
                let right = Math.floor(Math.random() * 9) + 1;
                let leftGram = left * 100; // ons → gram
                let rightGram = right * 100;

                if (leftGram > rightGram) {
                    question = `Mana yang lebih berat, ${left} ons atau ${right} ons?`;
                    answer = left;
                } else if (leftGram < rightGram) {
                    question = `Mana yang lebih berat, ${left} ons atau ${right} ons?`;
                    answer = right;
                } else {
                    question = `${left} ons dan ${right} ons memiliki berat yang sama.`;
                    answer = left;
                }
            }

            else if (questionType == "Selisih Berat") {
                // pilih satuan secara acak (kg, ons, gram)
                const units = ["kg", "ons", "gram"];
                const unit = units[Math.floor(Math.random() * units.length)];

                // buat dua berat acak kecil (biar tidak ribuan)
                let a = Math.floor(Math.random() * 9) + 1; // 1–9
                let b = Math.floor(Math.random() * 9) + 1; // 1–9

                // pastikan selisihnya tidak negatif
                let diff = Math.abs(a - b);

                // buat soal yang jelas dan mudah
                question = `Berat benda A ${a} ${unit} dan benda B ${b} ${unit}. Selisih berat keduanya ... ${unit}.`;
                answer = diff;
            }
            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], hqArray));
        hqArray.push([question, answer]);
    }

    return hqArray;
}

function returnVolumeQuestionArray(optionArray, qno) {
    let vqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            // Soal konversi volume
            if (questionType == "Konversi Volume") {
                const types = [
                    { text: (x) => `${x} liter = ... mililiter`, calc: (x) => x * 1000 },
                    { text: (x) => `${x * 1000} mililiter = ... liter`, calc: (x) => x },
                    { text: (x) => `${x * 500} mililiter = ... liter`, calc: (x) => (x * 500) / 1000 }
                ];
                const chosen = types[Math.floor(Math.random() * types.length)];
                const num = Math.floor(Math.random() * 5) + 1; // 1–5 liter
                question = chosen.text(num);
                answer = chosen.calc(num);

                // ===== 2. Tambah Volume =====
            } else if (questionType == "Tambah & Kurang Volume") {
                let a = Math.floor(Math.random() * 5) + 1; // 1–5
                let b = Math.floor(Math.random() * 5) + 1; // 1–5
                question = `Di ember ada ${a} liter air, lalu ditambah ${b} liter lagi. Sekarang airnya jadi ... liter.`;
                answer = a + b;

                // ===== 3. Selisih Volume =====
            } else if (questionType == "Selisih Volume") {
                let a = Math.floor(Math.random() * 8) + 2; // 2–9
                let b = Math.floor(Math.random() * a);     // lebih kecil dari a
                question = `Ember A berisi ${a} liter air dan ember B berisi ${b} liter air. Selisih airnya adalah ... liter.`;
                answer = a - b;

                // ===== 4. Perkiraan Volume =====
            } else if (questionType == "Bandingkan Volume") {
                const types = [
                    { q: `Sebuah gelas berisi setengah air dari 1 liter botol. Kira-kira berapa mililiter air di gelas itu?`, a: 500 },
                    { q: `Sebuah ember bisa menampung 10 liter air. Kalau diisi separuhnya, isinya ... liter.`, a: 5 },
                    { q: `Setengah dari 2 liter air adalah ... liter.`, a: 1 },
                    { q: `1/4 dari 1 liter air adalah ... mililiter.`, a: 250 }
                ];
                const chosen = types[Math.floor(Math.random() * types.length)];
                question = chosen.q;
                answer = chosen.a;
            }
            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], vqArray));
        vqArray.push([question, answer]);
    }

    return vqArray;
}

function returnUpQuestionArray(optionArray, qno) {
    let uqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            // ===== 1️⃣ Keliling Bangun Datar =====
            if (questionType == "Keliling Bangun Datar") {
                const shapes = [
                    { q: (s) => `Persegi dengan sisi ${s} cm, berapa kelilingnya?`, a: (s) => 4 * s },
                    { q: (p, l) => `Persegi panjang ${p} cm × ${l} cm, berapa kelilingnya?`, a: (p, l) => 2 * (p + l) }
                ];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                let s = Math.floor(Math.random() * 10) + 2;
                let p = Math.floor(Math.random() * 10) + 3;
                let l = Math.floor(Math.random() * 10) + 2;
                question = shape.q.length === 1 ? shape.q(s) : shape.q(p, l);
                answer = shape.q.length === 1 ? shape.a(s) : shape.a(p, l);
            }

            // ===== 2️⃣ Volume Bangun Ruang =====
            else if (questionType == "Volume Bangun Ruang") {
                const types = [
                    { q: (s) => `Kubus dengan sisi ${s} cm, berapa volumenya?`, a: (s) => s ** 3 },
                    { q: (p, l, t) => `Balok ${p}×${l}×${t} cm, berapa volumenya?`, a: (p, l, t) => p * l * t }
                ];
                const type = types[Math.floor(Math.random() * types.length)];
                let p = Math.floor(Math.random() * 10) + 2;
                let l = Math.floor(Math.random() * 10) + 2;
                let t = Math.floor(Math.random() * 10) + 2;
                let s = Math.floor(Math.random() * 10) + 2;
                question = type.q.length === 1 ? type.q(s) : type.q(p, l, t);
                answer = type.q.length === 1 ? type.a(s) : type.a(p, l, t);
            }

            // ===== 3️⃣ Luas Permukaan Bangun Ruang =====
            else if (questionType == "Luas Permukaan Bangun Ruang") {
                const types = [
                    { q: (s) => `Kubus sisi ${s} cm, berapa luas permukaannya?`, a: (s) => 6 * s * s },
                    { q: (p, l, t) => `Balok ${p}×${l}×${t} cm, berapa luas permukaannya?`, a: (p, l, t) => 2 * (p * l + p * t + l * t) }
                ];
                const type = types[Math.floor(Math.random() * types.length)];
                let s = Math.floor(Math.random() * 10) + 2;
                let p = Math.floor(Math.random() * 10) + 2;
                let l = Math.floor(Math.random() * 10) + 2;
                let t = Math.floor(Math.random() * 10) + 2;
                question = type.q.length === 1 ? type.q(s) : type.q(p, l, t);
                answer = type.q.length === 1 ? type.a(s) : type.a(p, l, t);
            }

            // ===== 4️⃣ Perbandingan Bangun =====
            else if (questionType == "Perbandingan Bangun") {
                let luas1 = Math.floor(Math.random() * 50) + 10;
                let luas2 = luas1 * 2;
                question = `Luas bangun A ${luas1} cm² dan bangun B ${luas2} cm². Berapa kali lebih besar bangun B dibanding A?`;
                answer = luas2 / luas1;
            }

            // ===== 5️⃣ Perkiraan Volume =====
            else if (questionType == "Perkiraan Volume") {
                const data = [
                    { q: `Botol 1 liter berisi setengah air. Kira-kira airnya ... ml.`, a: 500 },
                    { q: `Ember 10 liter berisi 1/4 air. Kira-kira airnya ... liter.`, a: 2.5 },
                    { q: `Separuh dari 6 liter air adalah ... liter.`, a: 3 }
                ];
                const pick = data[Math.floor(Math.random() * data.length)];
                question = pick.q;
                answer = pick.a;
            }

            // ===== 6️⃣ Bangun Campuran =====
            else if (questionType == "Bangun Campuran") {
                let luasPersegi = Math.floor(Math.random() * 50) + 10;
                let luasSegitiga = Math.floor(Math.random() * 30) + 10;
                question = `Sebuah taman terdiri dari persegi (${luasPersegi} cm²) dan segitiga (${luasSegitiga} cm²). Berapa total luas taman?`;
                answer = luasPersegi + luasSegitiga;
            }

            // ===== 7️⃣ Hubungan Luas dan Volume =====
            else if (questionType == "Hubungan Luas dan Volume") {
                let sisi = Math.floor(Math.random() * 8) + 2;
                let luasPermukaan = 6 * sisi * sisi;
                question = `Kubus memiliki luas permukaan ${luasPermukaan} cm². Berapa panjang sisinya?`;
                answer = sisi;
            }

            // ===== 8️⃣ Keliling Bangun Datar (ulang beda bentuk) =====
            else if (questionType == "Keliling Bangun Datar 2") {
                let jari = Math.floor(Math.random() * 10) + 2;
                question = `Lingkaran dengan jari-jari ${jari} cm. Kelilingnya (gunakan π=3,14) adalah ... cm.`;
                answer = parseFloat((2 * 3.14 * jari).toFixed(2));
            }

            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], uqArray));

        uqArray.push([question, answer]);
    }

    return uqArray;
}

function returnOperatorQuestionArray(optionArray, qno) {
    let opqArray = [];
    let questionType = optionArray[0];

    for (let i = 0; i < qno; i++) {
        let question, answer;
        let attempts = 0;

        do {
            attempts++;

            if (questionType == "Kurang") {
                let a = Math.floor(Math.random() * 20) + 1;
                let b = Math.floor(Math.random() * 20) + 1;
                let max = Math.max(a, b);
                let min = Math.min(a, b);
                question = `${max} - ${min} = ?`;
                answer = max - min;
            } else if (questionType == "Tambah") {
                let a = Math.floor(Math.random() * 20) + 1;
                let b = Math.floor(Math.random() * 20) + 1;
                question = `${a} + ${b} = ?`;
                answer = a + b;
            } else if (questionType == "Bagi") {
                let b = Math.floor(Math.random() * 12) + 1;
                let ans = Math.floor(Math.random() * 12) + 1;
                let a = b * ans;
                question = `${a} ÷ ${b} = ?`;
                answer = ans;
            } else if (questionType == "Kali") {
                let a = Math.floor(Math.random() * 12) + 1;
                let b = Math.floor(Math.random() * 12) + 1;
                question = `${a} × ${b} = ?`;
                answer = a * b;
            }

            if (attempts > 20) break;

        } while (!question || !answer || checkQuestionArray([question, answer], opqArray));
        opqArray.push([question, answer]);
    }

    return opqArray;
}

/**
 * Function to return exam questions from localStorage
 * @param  {[string]}    optionArray     [Array with exam type - "Essay" or "Pilihan Ganda"]
 * @param  {[number]}    qno             [Number of questions requested]
 * @return {[array]}                     [Question and answer array]
 */
function returnExamQuestionArray(optionArray, qno) {
    let examType = optionArray[0]; // "Essay", "Pilihan Ganda", atau "Visual"
    let examArray = [];
    let sourceQuestions = [];

    console.log("🎯 Mode Exam - optionArray:", optionArray);
    console.log("🎯 examType:", examType);

    // Load questions from localStorage based on exam type
    if (examType === "Essay") {
        sourceQuestions = getEssayQuestions();
        console.log("📝 Essay questions loaded:", sourceQuestions);
    } else if (examType === "Pilihan Ganda") {
        sourceQuestions = getPilganQuestions();
        console.log("📋 Pilgan questions loaded:", sourceQuestions);
    } else if (examType === "Visual") {
        sourceQuestions = getVisualQuestions();
        console.log("🖼️ Visual questions loaded:", sourceQuestions);
    }

    // Check if there are questions available
    if (sourceQuestions.length === 0) {
        console.warn(`⚠️ Tidak ada soal ${examType} yang tersimpan di localStorage`);
        console.log("💾 localStorage keys:", Object.keys(localStorage));
        console.log("💾 Essay key:", localStorage.getItem('balloon_pop_essay_questions'));
        console.log("💾 Pilgan key:", localStorage.getItem('balloon_pop_pilgan_questions'));
        console.log("💾 Visual key:", localStorage.getItem('balloon_pop_visual_questions'));
        // Return empty array or default questions
        return [];
    }

    // Shuffle questions to randomize
    sourceQuestions = shuffleArray(sourceQuestions.slice());

    // Take only the number of questions requested (or all if less than requested)
    let numQuestions = Math.min(qno, sourceQuestions.length);

    for (let i = 0; i < numQuestions; i++) {
        let q = sourceQuestions[i];
        
        // For multiple choice, store choices in question object for later use
        if (examType === "Pilihan Ganda" && q.choices) {
            // Format: [question, answer, choices]
            examArray.push([q.question, q.answer, q.choices]);
        } else if (examType === "Visual" && q.imageData) {
            // For visual: [question, answer, choices, imageData]
            // answer is the letter (A, B, C, D)
            examArray.push([q.question, q.answer, q.choices, q.imageData]);
        } else {
            // For essay: [question, answer]
            examArray.push([q.question, q.answer]);
        }
    }

    return examArray;
}


/**
* [Function to check if a new question is already contained in the question array]
* @param  {[array]}     nq              [New question, 2 item array of question and answer]
* @return {[array]}     qArray          [Question array, array of 2 item arrays to check]
*/
function checkQuestionArray(nq, qArray) {
                let i = 0;
                let qCheck = false;
                while ((qCheck == false) && (i < qArray.length)) {
                    if (qArray[i][0] == nq[0]) {
                        qCheck = true;
                    }
                    i++;
                }
                return (qCheck);
            }

/**
* [Function to generate array of 5 wrong answers and the correct answer, given game mode and current question]
* @param  {[string]}    gameMode        [Game mode]
* @param  {[array]}     qCurrent        [Current question array, array of 2 items giving question and answer]
* @return {[array]}                     [Array of 2 item arrays, 5 wrong answers and 1 correct answer]
*/
function answerArray(gameMode, qCurrent) {
            // Initialise answer array
            let answerArray = [];
            // Check game mode, run relevant wrong answer function to add wrong answers to answer array
            if (gameMode == 'aljabar') {
                answerArray = wrongAnswerAljabarQuestion(qCurrent);
            } else if (gameMode == 'time') {
                answerArray = wrongAnswerTimeQuestion(qCurrent);
            } else if (gameMode == 'heavy') {
                answerArray = wrongAnswerHeavyQuestion(qCurrent);
            } else if (gameMode == 'volume') {
                answerArray = wrongAnswerVolumeQuestion(qCurrent);
            } else if (gameMode == 'up') {
                answerArray = wrongAnswerUpQuestion(qCurrent);
            } else if (gameMode == 'operator') {
                answerArray = wrongAnswerOperatorQuestion(qCurrent);
            } else if (gameMode == 'exam') {
                // For exam mode, check if it's multiple choice (has choices) or essay
                if (qCurrent.length > 2 && qCurrent[2]) {
                    // Pilihan Ganda - return letters A, B, C, D as balloon answers
                    // and create mapping from letters to actual answers
                    let choices = qCurrent[2];
                    let correctAnswer = qCurrent[1];
                    
                    // Create mapping from letter to choice
                    bpmMultipleChoiceMapping = {};
                    for (let i = 0; i < choices.length; i++) {
                        let letter = String.fromCharCode(65 + i); // A, B, C, D
                        bpmMultipleChoiceMapping[letter] = choices[i];
                    }
                    
                    // Return array of letters A, B, C, D (4 items only for 4 balloons)
                    answerArray = ["A", "B", "C", "D"];
                    
                    console.log("🔤 Multiple Choice Mapping:", bpmMultipleChoiceMapping);
                    console.log("✅ Correct Answer:", correctAnswer);
                    
                    return answerArray;
                } else {
                    // Essay - generate wrong answers based on correct answer
                    answerArray = wrongAnswerExamQuestion(qCurrent);
                }
            }
            // Add correct answer to answer array
            answerArray.push(qCurrent[1]);
            // Shuffle answer array to randomise order
            answerArray = shuffleArray(answerArray);
            return (answerArray);
        }


        /**
         * [Function to generate array of 5 wrong answers for algebra questions]
         * @param  {[array]} qCurrent [Current question array: [question, correctAnswer]]
         * @return {[array]}          [Array of 5 wrong answers]
         */
        function wrongAnswerAljabarQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        function generateSmartWrongAnswers(correctAnswer, count) {
            let cA = Number(correctAnswer);
            if (isNaN(cA)) cA = 0;
            
            let wrongAnswerArray = [];
            let magnitude = Math.max(1, Math.abs(cA));
            
            let offsets;
            if (magnitude <= 10) {
                offsets = [1, 2, 3, -1, -2, -3];
            } else if (magnitude <= 100) {
                offsets = [1, 2, 5, 10, -1, -2, -5, -10];
            } else if (magnitude <= 1000) {
                offsets = [1, 5, 10, 50, 100, -1, -5, -10, -50, -100];
            } else {
                let step = Math.pow(10, Math.floor(Math.log10(magnitude)) - 1);
                offsets = [step, step*2, step*5, -step, -step*2, -step*5];
            }
            
            for (let offset of offsets) {
                let wrong = cA + offset;
                if (wrong >= 0 && wrong !== cA && !wrongAnswerArray.includes(wrong)) {
                    wrongAnswerArray.push(wrong);
                    if (wrongAnswerArray.length >= count) break;
                }
            }
            
            let maxAttempts = 50;
            let attempts = 0;
            while (wrongAnswerArray.length < count && attempts < maxAttempts) {
                attempts++;
                let variance = Math.max(5, Math.floor(magnitude * 0.3));
                let rand = cA + Math.floor(Math.random() * variance * 2) - variance;
                if (rand >= 0 && rand !== cA && !wrongAnswerArray.includes(rand)) {
                    wrongAnswerArray.push(rand);
                }
            }
            
            wrongAnswerArray = wrongAnswerArray.sort(() => Math.random() - 0.5);
            return wrongAnswerArray.slice(0, count);
        }

        function wrongAnswerTimeQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        function wrongAnswerHeavyQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        function wrongAnswerVolumeQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        function wrongAnswerUpQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        function wrongAnswerOperatorQuestion(qCurrent) {
            let cA = qCurrent[1];
            return generateSmartWrongAnswers(cA, 5);
        }

        /**
         * [Function to generate array of 5 wrong answers for exam essay questions]
         * @param  {[array]} qCurrent [Current question array: [question, correctAnswer]]
         * @return {[array]}          [Array of 5 wrong answers]
         */
        function wrongAnswerExamQuestion(qCurrent) {
            let cA = qCurrent[1]; // Correct answer
            let wrongAnswerArray = [];

            // Check if answer is numeric
            if (!isNaN(cA) && cA !== null && cA !== '') {
                // Generate wrong answers for numeric answers
                let numAnswer = Number(cA);
                let offsets = [1, 2, -1, -2];
                
                offsets.forEach(offset => {
                    let wrong = numAnswer + offset;
                    if (wrong >= 0) { // Avoid negative numbers unless meaningful
                        wrongAnswerArray.push(wrong);
                    }
                });

                // Add one more random number if needed
                while (wrongAnswerArray.length < 5) {
                    let rand = Math.floor(Math.random() * 100);
                    if (!wrongAnswerArray.includes(rand) && rand !== numAnswer) {
                        wrongAnswerArray.push(rand);
                    }
                }
            } else {
                // For text answers, generate variations
                // This is tricky - for now, add some placeholder wrong answers
                // Teachers should use multiple choice for text-based questions
                wrongAnswerArray = [
                    "Jawaban A",
                    "Jawaban B", 
                    "Jawaban C",
                    "Jawaban D",
                    "Jawaban E"
                ];
            }

            // Shuffle wrong answers
            wrongAnswerArray = wrongAnswerArray.sort(() => Math.random() - 0.5);

            // Return exactly 5 wrong answers
            return wrongAnswerArray.slice(0, 5);
        }

        /**
        * [Function to populate wrong answer array with two randomly generated integers between the two integers given. 
          Generates random integers until a random integer not already in the array and not equal to the correct answer is found.
          Returns completed wrong answer array]
        * @param  {[array]}     wrongAnswerArray    [Array of 2 item arrays]
        * @param  {[number]}    cA                  [Correct answer]
        * @param  {[number]}    minInt              [Minimum integer]
        * @param  {[number]}    maxInt              [Maximum integer]
        * @return {[array]}                         [Array of 2 item arrays]
        */
        function wrongAnswerArrayComplete(wrongAnswerArray, cA, minInt, maxInt) {
            if ((maxInt - minInt) < 6) {
                maxInt = minInt + 6;
            }
            // Get random integer between 2 integers given
            let randomInt;
            randomInt = getRandomIntInclusive(minInt, maxInt);
            // Check if random integer is in wrong answer array, generate another random integer if it is
            while ((wrongAnswerArray.includes(randomInt)) || (randomInt == cA)) {
                randomInt = getRandomIntInclusive(minInt, maxInt);
            }
            // Add random integer to wrong answer array
            wrongAnswerArray.push(randomInt);
            // Get random integer between 2 integers given
            randomInt = getRandomIntInclusive(minInt, maxInt);
            // Check if random integer is in wrong answer array, generate another random integer if it is
            while ((wrongAnswerArray.includes(randomInt)) || (randomInt == cA)) {
                randomInt = getRandomIntInclusive(minInt, maxInt);
            }
            // Add random integer to wrong answer array
            wrongAnswerArray.push(randomInt);
            return (wrongAnswerArray);
        }

        /**
        * [Function to generate a random integer between the two integers given. 
          Function referenced from MDN Web Docs link below:
          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random]
        * @param  {[number]}    min             [Minimum integer]
        * @param  {[number]}    max             [Maximum integer]
        * @return {[number]}                    [Integer]
        */
        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            // The maximum is inclusive and the minimum is inclusive
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        /**
        * [Function to randomize an array in place using the Durstenfeld shuffle algorithm. 
          Function referenced from stack overflow link below, many thanks to Laurens Holst:
          https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array]
        * @param  {[array]}     arrayToShuffle  [Array to shuffle]
        * @return {[array]}                     [Shuffled array]
        */
        function shuffleArray(arrayToShuffle) {
            let j;
            for (let i = arrayToShuffle.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                [arrayToShuffle[i], arrayToShuffle[j]] = [arrayToShuffle[j], arrayToShuffle[i]];
            }
            return (arrayToShuffle);
        }
