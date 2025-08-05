document.addEventListener('DOMContentLoaded', (event) => {
    // Data de início do meu curso de TI: 01 de Fevereiro de 2015
    // As datas no JavaScript são baseadas em milissegundos desde 01/01/1970 UTC
    // Mês é 0-indexed, então Fevereiro é 1
    const startDate = new Date(2015, 0, 1, 0, 0, 0); // Ano, Mês (0-11), Dia, Hora, Minuto, Segundo

    const contadorElement = document.getElementById('contadorProcrastinacao');

    function updateCounter() {
        const now = new Date();
        const diffMs = now.getTime() - startDate.getTime(); // Diferença em milissegundos

        // Calculando as unidades de tempo
        let seconds = Math.floor(diffMs / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);

        // Para meses e anos, uma vez que a duração dos meses varia,
        // vou fazer uma aproximação baseada em dias médios.
        // Se a precisão absoluta do calendário fosse crucial (o que não parece ser o caso para minha "procrastinação"),
        // seria mais complexo, mas para um contador em tempo real, esta é uma abordagem comum.
        const years = Math.floor(days / 365.25); // Usando 365.25 para considerar anos bissextos
        days %= 365.25; // Dias restantes após remover os anos completos
        const months = Math.floor(days / 30.44); // Minha aproximação de dias por mês
        
        days %= 30.44; // Dias restantes após remover os meses completos
        hours %= 24; // Horas restantes no dia
        minutes %= 60; // Minutos restantes na hora
        seconds %= 60; // Segundos restantes no minuto

        // Minha função para formatar números com zero à esquerda (ex: 05 em vez de 5)
        function formatNumber(num) {
            return num < 10 ? '0' + num : num;
        }

        // Construindo a string que vou exibir
        const counterText = 
            `${years} ano${years !== 1 ? 's' : ''}, ` +
            `${months} mês${months !== 1 ? 'es' : ''}, ` +
            `${Math.floor(days)} dia${Math.floor(days) !== 1 ? 's' : ''}, ` + // Arredonda os dias para não ter casas decimais na exibição
            `${formatNumber(hours)} hora${hours !== 1 ? 's' : ''}, ` +
            `${formatNumber(minutes)} minuto${minutes !== 1 ? 's' : ''}, e ` +
            `${formatNumber(seconds)} segundo${seconds !== 1 ? 's' : ''}`;

        contadorElement.textContent = counterText;
    }

    // Chamo a função uma vez imediatamente para evitar delay inicial
    updateCounter();

    // Atualizo o contador a cada segundo
    setInterval(updateCounter, 1000);
});