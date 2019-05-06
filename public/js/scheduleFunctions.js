
// ------------------- FORMATTING -------------------

// FORMATS THE SCHEDULE ACCORDING TO ITS CURRENT STATE
const scheduleStyle = (title) => {
    const date = title.split('-')
    scheduleFormTitle.textContent = `${date[0]} ${date[1]}, ${date[2]}`
    schedule.style.opacity = isScheduleOpen ? 0.9 : 0
    schedule.style.width = isScheduleOpen ? '480px' : '0px'
    schedule.style.height = isScheduleOpen ? '540px' : '0px'
    schedule.style.visibility = isScheduleOpen ? 'visible' : 'hidden'
}

// FORMATS INPUT FORM ON EDIT
const inputStyle = () => {
    const defaults = [scheduleInputFrom.className, scheduleInputTo.className, scheduleInputDescription.className]
    scheduleInputFrom.className += ' input--edit'
    scheduleInputTo.className += ' input--edit'
    scheduleInputDescription.className += ' input--edit'
    setTimeout(() => {
        scheduleInputFrom.className = defaults[0]
        scheduleInputTo.className = defaults[1]
        scheduleInputDescription.className = defaults[2]
    }, 350)
}

// CHECKS IF TIME FORMAT IS CORRECT
const checkTimeFormat = (time) => {
    if (!time.match(/^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/)) {
        return 'Time format has to be HH:MM'
    }
}

// PARSES TIME STRING TO INTEGER VALUES
const parseTime = (time) => {
    return parseInt(time.slice(0, 2) + time.slice(3, 5))
}

// ------------------- ERRORS -------------------

// ERROR HANDLER FUNCTION
const handleError = (errorMessage, domElement) => {
    scheduleFormError.textContent = errorMessage
    scheduleFormError.style.display = 'block'
    domElement.style.border = '2px solid red'
    setTimeout(() => {
        scheduleFormError.style.display = 'none'
        domElement.style.border = ''
        if (domElement.tagName === 'INPUT') { domElement.value = '' }
    }, 2500)
}

// CHECKS IF SUBMITTED APPOINTMENT COLLIDES WITH AN EXISTING ONE AND RETURNS ITS INDEX
const checkTimeCollision = (day, fromTime, toTime) => {
    const collisionIndex = day.data.findIndex((element) => {
        const elemFromTime = parseTime(element.fromTime)
        const elemToTime = parseTime(element.toTime)
        const formFromTime = parseTime(fromTime)
        const formToTime = parseTime(toTime)

        // CHECK IF FORMINPUT IS INSIDE ELEM
        const condition1 = elemFromTime < formFromTime && formFromTime < elemToTime
        const condition2 = elemFromTime < formToTime && formToTime < elemToTime

        // CHECK IF ELEM IS INSIDE FORMINPUT
        const condition3 = formFromTime < elemFromTime && elemFromTime < formToTime
        const condition4 = formFromTime < elemToTime && elemToTime < formToTime

        // CHECK IF BOTH ARE EQUAL
        const condition5 = elemFromTime === formFromTime && elemToTime === formToTime

        return (condition1 || condition2 || condition3 || condition4 || condition5)
    })
    return collisionIndex
}

// CHECKS FROMTIME COMES BEFORE TOTIME
const checkTimeOrder = (fromTime, toTime) => {
    if (parseTime(fromTime) > parseTime(toTime)) {
        return 'Appointment end time cannot be earlier than the start time'
    }
}

// ------------------- DOM GENERATORS -------------------

// GENERATE APPOINTMENT DOM ELEMENTS
const generateAppointment = (data, index) => {
    const appointmentDiv = document.createElement('div')
    appointmentDiv.className = 'appointment pop-up'
    appointmentDiv.id = `appointment${index}`
    schedule.append(appointmentDiv)

    const fromTimeDiv = document.createElement('div')
    fromTimeDiv.textContent = data.fromTime
    fromTimeDiv.className = 'appointment-time from'
    appointmentDiv.append(fromTimeDiv)

    const toTimeDiv = document.createElement('div')
    toTimeDiv.textContent = data.toTime
    toTimeDiv.className = 'appointment-time to'
    appointmentDiv.append(toTimeDiv)

    const descriptionDiv = document.createElement('div')
    descriptionDiv.textContent = data.description
    descriptionDiv.className = 'appointment-description'
    appointmentDiv.append(descriptionDiv)

    const removeButton = document.createElement('button')
    removeButton.textContent = 'x'
    removeButton.className = 'remove-appointment'
    removeButton.addEventListener('click', (e) => {
        e.stopPropagation()
        removeAppointment(index)
    })
    appointmentDiv.append(removeButton)
}

// REMOVES AN APPOINTMENT FROM THE SCHEDULE
const removeAppointment = (index) => {
    const object = scheduleGetObject(clickedDay)
    object.data.splice(index, 1)
    formatDayBackground()
    saveData()
    scheduleClear()
    scheduleGetAppointments(clickedDay)
}

// CLEARS THE SCHEDULE
const scheduleClear = () => {
    while (schedule.lastChild !== scheduleForm) {
        schedule.removeChild(schedule.lastChild)
    }
}

// GET APPOINTMENTS FOR CLICKED DAY
const scheduleGetAppointments = (day) => {
    const object = scheduleGetObject(day)

    if (!object) { return }

    object.data.forEach((data, index) => {
        generateAppointment(data, index)
    })
}

// ------------------- ARRAY MANIPULATION -------------------

// RETURNS OBJECT OF DAY
const scheduleGetObject = (day) => {
    return scheduleData.find((element) => {
        return element.date.toString() === day.toString()
    })
}

// ORDER APPOINTMENTS BY TIME
const orderAppointments = (data) => {
    data.sort((a, b) => {
        const aIntFromTime = parseTime(a.fromTime)
        const aIntToTime = parseTime(a.toTime)
        const bIntFromTime = parseTime(b.fromTime)

        if (aIntFromTime < bIntFromTime) { return -1 }
        else if (aIntFromTime > bIntFromTime) { return 1 }
        else if (aIntFromTime === aIntToTime) { return -1 }
        else { return 1 }
    })
}

// SAVE DATA TO LOCALSTORAGE
const saveData = () => {
    scheduleDataJSON = JSON.stringify(scheduleData)
    window.localStorage.setItem('scheduleData', scheduleDataJSON)
}

// LOAD DATA FROM LOCALSTORAGE
const loadData = () => {
    const scheduleDataJSON = window.localStorage.getItem('scheduleData')
    if (!scheduleDataJSON) { return }
    const scheduleData = JSON.parse(scheduleDataJSON)
    scheduleData.forEach((element) => element.date = new Date(element.date))
    return scheduleData
}