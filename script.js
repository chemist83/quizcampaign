document.addEventListener('DOMContentLoaded', () => {

    const applicationForm = document.getElementById('application-form');

    const openInfoModalButton = document.getElementById('open-info-modal-button'); // Yeni buton referansı

    const quizSection = document.getElementById('quiz-section');

    const quizContainer = document.getElementById('quiz-container');

    const submitQuizButton = document.getElementById('submit-quiz-button');

    const quizResult = document.getElementById('quiz-result');

    const quizTimer = document.getElementById('quiz-timer');

    const timeLeftSpan = document.getElementById('time-left');

    const adModal = document.getElementById('ad-modal');

    const closeButtonAdModal = document.querySelector('#ad-modal .close-button'); // Reklam modalının kapatma butonu

    const closeStickyAdButtonBottom = document.getElementById('close-sticky-ad');

    const stickyAdBottom = document.getElementById('sticky-ad-bottom');

    const closeStickyAdButtonTop = document.getElementById('close-sticky-ad-top');

    const stickyAdTop = document.getElementById('sticky-ad-top');

    // YENİ: Bilgilendirme Modalı Elementleri

    const infoModal = document.getElementById('info-modal');

    const closeInfoModalButton = document.getElementById('close-info-modal');

    const infoReadCheckbox = document.getElementById('info-read-checkbox');

    const startQuizFromModalButton = document.getElementById('start-quiz-from-modal');

    const QUIZ_TOTAL_DURATION = 15; // Toplam quiz süresi 10 saniye

    let timerInterval;

    const QUIZ_ATTEMPT_KEY = 'quizAttempted'; // localStorage anahtarı

    // Quiz soruları

    const quizQuestions = [

        {

            question: "Atomun çekirdeğinde bulunan pozitif yüklü tanecik nedir?(What is the positively charged particle in atomic nucleus?)",

            options: ["Neuron", "Photon", "Electron", "Proton"],

            answer: "Proton"

        },

        {

            question: "Hangi element periyodik tabloda sembolü 'Fe' ile gösterilir?(Which element is shown as 'Fe' symbol?)",

            options: ["Phosphorus", "Fluroine", "Iron", "Ironium"],

            answer: "1881"

        },

        {

            question: "Su molekülünün kimyasal formülü nedir?(What is the chemical formula of water molecule?)",

            options: ["CO<sub>2</sub>", "H<sub>3</sub>O<sub>2</sub>O<sub>2</sub>", "H<sub>2</sub>O", "2H"],

            answer: "H<sub>2</sub>O"

        },

        {

            question: "Asitlerin pH değeri genellikle hangi aralıktadır?(What is usually the pH period of bases?)",

            options: ["Lower than 7", "Higher than 7", "7", "7-14"],

            answer: "7-14"

        },

        {

            question: "Periyodik tabloda dikey sütunlara ne ad verilir?(What is the name of vertical column in periodic table?)",

            options: ["group", "gruop", "period", "peroid"],

            answer: "100"

        },
        
        {

            question: "Oda sıcaklığında sıvı halde bulunan tek metal element hangisidir?(What is single metal that is solid in temperature of room?)",

            options: ["Aluminium", "Mercury", "Venus", "Sodium"],

            answer: "Mercury" // Seçeneklerden biriyle aynı olmalı

        },
      
        {

            question: "Yanma tepkimeleri genellikle hangi gazın varlığında gerçekleşir?(which gas provides burning reactions happen? )",

            options: ["oxgyenium", "oxygen", "hydrogen", "helium"],

            answer: "oxygen" // Seçeneklerden biriyle aynı olmalı

        }
    ];

    // --- Başlangıç Durumu Kontrolleri ---

    // Kullanıcının daha önce quiz'e girip girmediğini kontrol et

    if (localStorage.getItem(QUIZ_ATTEMPT_KEY) === 'true') {

        applicationForm.innerHTML = `<p class="message-info">You joined previously. You can't attend again. Thanks for answering!</p>`;

        applicationForm.querySelector('button').style.display = 'none'; // Butonu gizle

    } else {

        applicationForm.style.display = 'block'; // Formu göster

    }

    // Pop-up reklamı göster (daha önce kapatılmadıysa)

    showAdModal();

    // --- Reklam Penceresi İşlevleri ---

    function showAdModal() {

        if (adModal) {

            setTimeout(() => {

                adModal.style.display = 'flex';

            }, 3000); // 3 saniye sonra göster

        }

    }

    // Kapatma butonuna tıklandığında modali gizle

    if (closeButtonAdModal && adModal) {

        closeButtonAdModal.addEventListener('click', () => {

            adModal.style.display = 'none';

        });

    }

    // Modal dışına tıklandığında modali gizle

    if (adModal) {

        window.addEventListener('click', (event) => {

            if (event.target === adModal) {

                adModal.style.display = 'none';

            }

        });

    }

    // Alt reklam bandı kapatma

    if (closeStickyAdButtonBottom && stickyAdBottom) {

        closeStickyAdButtonBottom.addEventListener('click', () => {

            stickyAdBottom.style.display = 'none';

        });

    }

    // Üst reklam bandı kapatma

    if (closeStickyAdButtonTop && stickyAdTop) {

        closeStickyAdButtonTop.addEventListener('click', () => {

            stickyAdTop.style.display = 'none';

        });

    }

    // --- YENİ: Bilgilendirme Modalı İşlevleri ---

    // "Başvur ve Bilgilendirmeyi Oku" butonuna tıklandığında bilgilendirme modalını aç

    openInfoModalButton.addEventListener('click', (e) => {

        e.preventDefault(); // Formun normal submit işlemini durdur

        // Eğer kullanıcı daha önce quize girdiyse engelle

        if (localStorage.getItem(QUIZ_ATTEMPT_KEY) === 'true') {

            alert('Quiz\'e daha önce katıldığınız için tekrar katılamazsınız.');

            return;

        }

        // Form bilgilerinin geçerliliğini kontrol et

        if (!applicationForm.checkValidity()) {

            applicationForm.reportValidity(); // HTML5 doğrulama mesajlarını göster

            return;

        }

        infoModal.style.display = 'flex'; // Modalı göster

        infoReadCheckbox.checked = false; // Modalı her açtığında kutucuğu işaretli olmasın

        startQuizFromModalButton.disabled = true; // Modalı her açtığında başla butonu pasif olsun

    });

    // Bilgilendirme modalının kapatma butonuna tıklandığında

    closeInfoModalButton.addEventListener('click', () => {

        infoModal.style.display = 'none';

    });

    // Bilgilendirme modalı dışına tıklandığında modali gizle

    window.addEventListener('click', (event) => {

        if (event.target === infoModal) {

            infoModal.style.display = 'none';

        }

    });

    // Onay kutusu değiştiğinde "Quize Başla" butonunu etkinleştir/devre dışı bırak

    infoReadCheckbox.addEventListener('change', () => {

        startQuizFromModalButton.disabled = !infoReadCheckbox.checked;

    });

    // Bilgilendirme modalındaki "Quize Başla" butonuna tıklandığında

    startQuizFromModalButton.addEventListener('click', () => {

        if (infoReadCheckbox.checked) {

            infoModal.style.display = 'none'; // Bilgilendirme modalını kapat

            startQuizProcess(); // Quizi başlatma işlemini çağır

        } else {

            alert('Quize başlamak için bilgilendirmeyi okuduğunuzu onaylamanız gerekmektedir.');

        }

    });

    // --- Quiz Başlatma İşlemi (Ortak Fonksiyon) ---

    function startQuizProcess() {

        const name = document.getElementById('name').value;

        const email = document.getElementById('email').value;

        const phone = document.getElementById('phone').value;

        console.log('Başvuru Bilgileri (Kaydedilmiyor):', { name, email, phone });

        // Başvuru formunu gizle ve quiz bölümünü göster

        applicationForm.style.display = 'none';

        quizSection.style.display = 'block';

        submitQuizButton.style.display = 'block';

        loadQuizQuestions(); // Quiz sorularını yükle

        localStorage.setItem(QUIZ_ATTEMPT_KEY, 'true'); // Kullanıcının quize girdiğini işaretle

        startQuizTimer(); // Zamanlayıcıyı başlat

    }

    // Quiz sorularını yükle

    function loadQuizQuestions() {

        quizContainer.innerHTML = ''; // Önceki soruları temizle

        quizQuestions.forEach((q, index) => {

            const questionDiv = document.createElement('div');

            questionDiv.classList.add('question');

            questionDiv.innerHTML = `

                <p>${index + 1}. ${q.question}</p>

                ${q.options.map(option => `

                    <label>

                        <input type="radio" name="question${index}" value="${option}">

                        ${escapeHTML(option)}

                    </label>

                `).join('')}

            `;

            quizContainer.appendChild(questionDiv);

        });

    }

    // Quiz Zamanlayıcı İşlevi

    function startQuizTimer() {

        let quizTimeLeft = QUIZ_TOTAL_DURATION; // Toplam quiz süresi

        timeLeftSpan.textContent = quizTimeLeft;

        timerInterval = setInterval(() => {

            quizTimeLeft--;

            timeLeftSpan.textContent = quizTimeLeft;

            if (quizTimeLeft <= 0) {

                clearInterval(timerInterval);

                submitQuiz('time_up'); // Süre bittiğinde quizi otomatik tamamla

            }

        }, 1000); // Her saniyede bir azalt

    }

    // Quizi bitir butonu tıklandığında

    submitQuizButton.addEventListener('click', () => submitQuiz('manual'));

    function submitQuiz(completionType) {

        clearInterval(timerInterval); // Zamanlayıcıyı durdur

        let score = 0;

        const totalQuestions = quizQuestions.length;

        quizQuestions.forEach((q, index) => {

            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);

            if (selectedOption && selectedOption.value === q.answer) {

                score++;

            }

        });

        // Quiz sonuçlarını göster

        quizResult.style.display = 'block';

        if (completionType === 'time_up') {

            quizResult.innerHTML = `Time's up! Quiz result: ${score} / ${totalQuestions} correct answers.`;

        } else {

            quizResult.innerHTML = `Quiz result: ${score} / ${totalQuestions} correct answers.`;

        }

        // Quiz bittikten sonra formu ve quiz butonunu gizle

        submitQuizButton.style.display = 'none';

        quizContainer.style.display = 'none';

        quizTimer.style.display = 'none'; // Zamanlayıcıyı da gizle

        // Kullanıcı quiz'i tamamladığı için artık tekrar giremez

        applicationForm.innerHTML = `<p class="message-info">Quiz'i tamamladınız veya süreniz doldu. Tekrar katılım sağlayamazsınız. Teşekkürler!</p>`;

        applicationForm.querySelector('button').style.display = 'none';

    }

    // HTML özel karakterlerini temizleme fonksiyonu (XSS saldırılarına karşı)

    function escapeHTML(str) {

        var div = document.createElement('div');

        div.appendChild(document.createTextNode(str));

        return div.innerHTML;

    }

});
