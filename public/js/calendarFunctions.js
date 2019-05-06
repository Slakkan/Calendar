const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const sunday = document.querySelector('.sunday')
const monday = document.querySelector('.monday')
const tuesday = document.querySelector('.tuesday')
const wednesday = document.querySelector('.wednesday')
const thursday = document.querySelector('.thursday')
const friday = document.querySelector('.friday')
const saturday = document.querySelector('.saturday')

const selectedMonth = document.querySelector('.month')

// ------------------- FORMATTING -------------------

// FORMATS DAY BACKGROUND COLOR DEPENDING ON THE AMOUNT OF APPOINTMENTS FOR THAT DAY
const formatDayBackground = () => {
    scheduleData.forEach((element) => {
        day = element.date
        div = document.querySelector(`#${monthNames[day.getMonth()]}-${day.getDate()}-${day.getFullYear()}`)
        if (!div) { return }
        if (element.data.length >= 5) {
            div.className = 'day day--high'
        } else if (element.data.length >= 3) {
            div.className = 'day day--medium'
        } else if (element.data.length >= 1) {
            div.className = 'day day--low'
        } else {
            div.className = 'day'
        }
    })
}

// ------------------- ARRAY MANIPULATION -------------------

// RETURNS AN ARRAY WICH CONTAINS THE DAYS OF THE MONTH
const getDays = (year, month) => {
    const daysOfMonth = []

    for (let i = 1; i < 32; i++) {
        let day = new Date(year, month, i)
        if (day.getMonth() === month) {
            daysOfMonth.push(day)
        }
    }

    return daysOfMonth
}

// ------------------- DOM GENERATORS -------------------

// GENERATES CALENDAR DOM ELEMENTS
const generateCalendar = (days = getDays(year, month)) => {
    selectedMonth.textContent = monthNames[month] + ', ' + year

    // DAYS THAT DON'T BELONG TO THIS MONTH
    const firstOfMonth = days[0].getDay()
    if (firstOfMonth > 0) {
        for (let i = 0; i < firstOfMonth; i++) {
            const div = document.createElement('div')
            div.className = 'day--other'
            selector(dayNames[i], div)
        }
    }

    // DAYS OF THIS MONTH
    days.forEach((day) => {
        const div = document.createElement('div')
        div.className = 'day'
        div.id = `${monthNames[day.getMonth()]}-${day.getDate()}-${day.getFullYear()}`
        div.textContent = day.getDate()
        selector(dayNames[day.getDay()], div)
    })

    formatDayBackground()
}

// APPENDS DAY TO CORRESPONDING DAYOFWEEK
const selector = (dayName, parent) => {
    switch (dayName) {
        case 'Sunday':
            return sunday.appendChild(parent)
        case 'Monday':
            return monday.appendChild(parent)
        case 'Tuesday':
            return tuesday.appendChild(parent)
        case 'Wednesday':
            return wednesday.appendChild(parent)
        case 'Thursday':
            return thursday.appendChild(parent)
        case 'Friday':
            return friday.appendChild(parent)
        case 'Saturday':
            return saturday.appendChild(parent)
        default:
            return
    }
}