document.addEventListener('DOMContentLoaded', (event) => {
    // Data de início do meu curso de TI: 01 de Fevereiro de 2015
    // As datas no JavaScript são baseadas em milissegundos desde 01/01/1970 UTC
    // Mês é 0-indexed, então Fevereiro é 1
    const startDate = new Date(2015, 0, 1, 0, 0, 0);

    const contadorElement = document.getElementById('contadorProcrastinacao');

    function updateCounter() {
        const now = new Date();
        const diffMs = now.getTime() - startDate.getTime();

        let seconds = Math.floor(diffMs / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        const years = Math.floor(days / 365.25);
        days %= 365.25;
        const months = Math.floor(days / 30.44);
        
        days %= 30.44;
        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        function formatNumber(num) {
            return num < 10 ? '0' + num : num;
        }

        const counterText = 
            `${years} ano${years !== 1 ? 's' : ''}, ` +
            `${months} mês${months !== 1 ? 'es' : ''}, ` +
            `${Math.floor(days)} dia${Math.floor(days) !== 1 ? 's' : ''}, ` +
            `${formatNumber(hours)} hora${hours !== 1 ? 's' : ''}, ` +
            `${formatNumber(minutes)} minuto${minutes !== 1 ? 's' : ''}, e ` +
            `${formatNumber(seconds)} segundo${seconds !== 1 ? 's' : ''}`;

        contadorElement.textContent = counterText;

        // Chamada recursiva: atualiza e se programa para rodar novamente em 1 segundo
        setTimeout(updateCounter, 1000);
    }

    // A primeira chamada para iniciar o contador
    updateCounter();
});