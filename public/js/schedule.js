
const schedule = document.querySelector('.schedule')
const scheduleFormTitle = document.querySelector('.form-title')
const scheduleForm = document.querySelector('.schedule-form')
const scheduleInputFrom = document.querySelector('.from')
const scheduleInputTo = document.querySelector('.to')
const scheduleInputDescription = document.querySelector('.description')
const scheduleFormError = document.querySelector('.form-error')
const scheduleFormAddAppointment = document.querySelector('.add-appointment')

const loadedData = loadData()

const scheduleData = loadedData ? loadedData : []

let isEditingAppointment = false

// EVENT LISTENER TO ADD AN APPOINTMENT
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault()
    isEditingAppointment = false

    // GET FORM INPUT DATA
    const fromTime = scheduleInputFrom.value
    const toTime = scheduleInputTo.value
    const description = scheduleInputDescription.value

    // CHECK FOR ERRORS IN INPUT DATA FORMAT
    const errorFrom = checkTimeFormat(fromTime)
    if (errorFrom) { handleError(errorFrom, scheduleInputFrom) }

    const errorTo = checkTimeFormat(toTime)
    if (errorTo) { handleError(errorTo, scheduleInputTo) }

    const errorOrder = checkTimeOrder(fromTime, toTime)
    if (errorOrder) { handleError(errorOrder, scheduleInputTo) }

    if (errorFrom || errorTo || errorOrder) { return }

    scheduleInputFrom.value = ''
    scheduleInputTo.value = ''
    scheduleInputDescription.value = ''

    // CHECK FOR EXISTING DATA FOR THAT DAY IF THERE IS NONE, CREATE THE ELEMENT
    const matchingDate = scheduleGetObject(clickedDay)
    if (matchingDate) {
        // CHECK FOR COLLISIONS WITH OTHER APPOINTMENTS
        const collisionIndex = checkTimeCollision(matchingDate, fromTime, toTime)
        if (collisionIndex !== -1) {
            const collisionErrorMessage = 'There is another appointment at that time'
            const collisionDOMElement = document.querySelector(`#appointment${collisionIndex}`)
            handleError(collisionErrorMessage, collisionDOMElement )
            return
        }

        // PUSH APPOINTMENT INTO DATA ARRAY
        matchingDate.data.push({ fromTime, toTime, description })
        orderAppointments(matchingDate.data)
        formatDayBackground()
        saveData()
    } else {
        // CREATE NEW OBJECT AND PUSH IT ONTO SCHEDULE DATA
        scheduleData.push({ date: clickedDay, data: [{ fromTime, toTime, description }] })
        formatDayBackground()
        saveData()
    }

    // GENERATE DOM ELEMENTS
    scheduleClear()
    scheduleGetAppointments(clickedDay)
})

// EVENT LISTENER TO EDIT AN APPOINTMENT
schedule.addEventListener('click', (e) => {
    const parent = e.target.parentElement

    // CHECK IF THERE IS ALREADY AN EDIT TAKING PLACE
    if (isEditingAppointment && parent.className.includes('appointment')) { 
        handleError('You have not finished editing this appointment', scheduleFormAddAppointment) 
    }

    // START EDITING APPOINTMENT
    if (!isEditingAppointment && parent.className.includes('appointment')) {
        isEditingAppointment = true

        // SET FOCUS DEPENDING WICH PART THE USER CLICKED
        if (e.target.className === 'appointment-time from') { scheduleInputFrom.focus() }
        if (e.target.className === 'appointment-time to') { scheduleInputTo.focus() }
        if (e.target.className === 'appointment-description') { scheduleInputDescription.focus() }

        // SET DATA ON INPUT
        scheduleInputFrom.value = parent.childNodes[0].textContent
        scheduleInputTo.value = parent.childNodes[1].textContent
        scheduleInputDescription.value = parent.childNodes[2].textContent

        parent.childNodes[3].click()
        inputStyle()
    }
})