const getCurrentLanguage = () => {
    const language = localStorage.getItem('language');

    return language || 'ru'
}

export {
    getCurrentLanguage
}
