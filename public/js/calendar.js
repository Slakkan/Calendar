const dates = document.querySelector('.dates')

const selectorMinus = document.querySelector('.minus')
const selectorPlus = document.querySelector('.plus')

const now = new Date()
let month = now.getMonth()
let year = now.getFullYear()

generateCalendar()

// EVENT LISTENER FOR (<) BUTTON
selectorMinus.addEventListener('click', () => {

    dates.childNodes.forEach((child) => {
        while (child.childNodes.length > 2) {
            child.removeChild(child.lastChild)
        }
    })

    if (month - 1 >= 0) {
        month -= 1
    } else {
        month = 11
        year -= 1
    }
    generateCalendar()
})

// EVENT LISTENER FOR (>) BUTTON
selectorPlus.addEventListener('click', () => {

    dates.childNodes.forEach((child) => {
        while (child.childNodes.length > 2) {
            child.removeChild(child.lastChild)
        }
    })

    if (month + 1 >= 11) {
        month = 0
        year += 1
    } else {
        month += 1
    }
    generateCalendar()
})

let isScheduleOpen = false
let clickedDay

// EVENT LISTENER FOR DATES
document.addEventListener('click', (e) => {
    if (!isScheduleOpen && e.target.className.includes('day')) {
        clickedDay = new Date(year, month, e.target.textContent)
        isScheduleOpen = true

        // Style schedule open for animation
        schedule.style.left = `${e.target.offsetLeft + 32}px`
        schedule.style.top = `${e.target.offsetTop + 32}px`
        scheduleStyle(e.target.id)

        // Get data after animation is complete
        setTimeout(() => { scheduleGetAppointments(clickedDay) }, 500)
    } else if ( isScheduleOpen && (!e.target.parentElement || !e.target.parentElement.className.includes('pop-up')) ) {
        isScheduleOpen = false

        // Style schedule close for animation
        scheduleStyle(e.target.id)

        // Clear data
        scheduleClear()
    }
})