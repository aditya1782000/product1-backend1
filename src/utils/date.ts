const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(date);
};
export default formatDate;
