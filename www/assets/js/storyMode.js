/**
 * [Function to generate story-based math questions for each game mode]
 * @param {string} gameMode - Mode permainan ("add", "subtract", "multiply", "divide", "fraction", "aljabar", "measurement")
 * @return {[array]} [Array berisi [soal, jawaban]]
 */
function getRandomStoryByMode(gameMode) {
    const names = ["Budi", "Ani", "Siti", "Andi", "Rani", "Tono", "Dewi"];
    const colors = ["merah", "biru", "kuning", "oranye", "hijau"];
    const items = ["kue", "roti", "pizza", "apel", "kotak", "buku"];
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let nama = rand(names);
    let warna = rand(colors);
    let benda = rand(items);
    let question = "";
    let answer;

    switch (gameMode) {

        // ➕ Mode Penjumlahan
        case "add":
            let a = randInt(1, 10);
            let b = randInt(1, 10);
            question = `${nama} memiliki ${a} ${benda} dan membeli ${b} lagi. Berapa jumlah ${benda} yang dimiliki ${nama} sekarang?`;
            answer = a + b;
            break;

        // ➖ Mode Pengurangan
        case "subtract":
            let total = randInt(5, 15);
            let used = randInt(1, total - 1);
            question = `${nama} memiliki ${total} ${benda}. ${used} ${benda} diberikan ke temannya. Berapa ${benda} yang tersisa?`;
            answer = total - used;
            break;

        // ✖️ Mode Perkalian
        case "multiply":
            let rows = randInt(2, 5);
            let cols = randInt(2, 5);
            question = `${nama} menata ${benda} dalam ${rows} baris dan ${cols} kolom. Berapa total ${benda} yang ditata ${nama}?`;
            answer = rows * cols;
            break;

        // ➗ Mode Pembagian
        case "divide":
            let totalItems = randInt(10, 30);
            let groups = randInt(2, 6);
            question = `${nama} memiliki ${totalItems} ${benda} dan membagikannya secara merata ke ${groups} teman. Berapa ${benda} yang diterima tiap teman?`;
            answer = Math.floor(totalItems / groups);
            break;

        // 🧮 Mode Aljabar
        case "aljabar":
            let x = randInt(1, 5);
            let y = randInt(1, 5);
            let result = x + y;
            question = `${nama} memikirkan sebuah bilangan x. Jika x + ${y} = ${result}, berapakah nilai x?`;
            answer = x;
            break;

        // 🍰 Mode Pecahan
        case "fraction":
            let penyebut = randInt(2, 5);
            let pembilang = randInt(1, penyebut - 1);
            question = `${nama} memiliki ${benda} yang dibagi menjadi ${penyebut} bagian. ${pembilang} bagian diwarnai ${warna}. Berapa bagian yang diwarnai ${warna}?`;
            answer = pembilang; // cuma angka murni
            break;

        // 📏 Mode Measurement
        case "measurement":
            let tipe = rand(["panjang", "luas", "volume", "waktu"]);
            if (tipe === "panjang") {
                let meter = randInt(2, 10);
                question = `${nama} memiliki pita sepanjang ${meter} meter. Berapa cm panjang pita ${nama}?`;
                answer = meter * 100 + " cm";
            } else if (tipe === "luas") {
                let sisi = randInt(2, 5);
                question = `Sebuah persegi memiliki sisi ${sisi} cm. Berapakah luasnya?`;
                answer = sisi * sisi + " cm²";
            } else if (tipe === "volume") {
                let sisi = randInt(2, 5);
                question = `Sebuah kubus memiliki sisi ${sisi} cm. Berapakah volumenya?`;
                answer = sisi ** 3 + " cm³";
            } else {
                let jam = randInt(1, 5);
                question = `${nama} belajar selama ${jam} jam. Berapa menit ${nama} belajar?`;
                answer = jam * 60 + " menit";
            }
            break;

        default:
            question = "Mode tidak dikenali.";
            answer = "";
    }

    return [question, answer];
}
