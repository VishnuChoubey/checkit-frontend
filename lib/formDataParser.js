function formDataParser(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
            data[key].forEach((value, index) => {
                if (value) {
                    if (value.uid) {
                        formData.append(key, value, value.name);
                    } else {
                        formData.append(`${key}[${index}]`, value);
                    }
                }
            });
        } else {
            formData.append(key, data[key]);
        }
    });
    return formData;
}

export default formDataParser;