chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "cacheClearAlarm") {
      clearCache();
      // Once cleared, set up the next alarm
      setupNextAlarm();
    }
  });
  
  function setupNextAlarm() {
    let nextAlarmTime = getNextScheduledTime(); // Assume this function returns the next desired timestamp
    chrome.alarms.create("cacheClearAlarm", { when: nextAlarmTime });
  }
  
  function clearCache() {
    chrome.browsingData.remove({ "since": 0 }, { "cache": true });
    console.log('Cache cleared');
  }
  
  function getNextScheduledTime() {
    // Calculate the next occurrence of 8:36 PM on Wednesday or Friday
    let now = new Date();
    let next = new Date(now);
    next.setHours(14, 36, 0, 0); // Set to 8:36 PM
    let day = now.getDay();
    let addDays = 0;
    let hour = now.getHours();
    let minute = now.getMinutes();
    
    if (day === 4 && (hour < 14 || (hour === 14 && minute < 36))) {
      // It's today
      addDays = 0;
    } else if (day < 3) {
      // Next Wednesday
      addDays = 3 - day;
    } else if (day === 3) {
      // Next Friday
      addDays = 2;
    } else if (day < 4) {
      // Next Friday
      addDays = 4 - day;
    } else {
      // Next Wednesday
      addDays = 3 + (7 - day);
    }
  
    next.setDate(now.getDate() + addDays);
  
    // If it's currently past 8:36 PM, schedule for the next occurrence
    if (addDays === 0 && (now.getHours() > 14 || (now.getHours() === 14 && now.getMinutes() >= 36))) {
      next.setDate(now.getDate() + (day === 4 ? 4 : 2)); // Next Wednesday if Friday, otherwise next Friday
    }
  
    return next.getTime();
  }
  
  // Initial setup
  setupNextAlarm();

  chrome.alarms.getAll((alarms) => {
    console.log('Scheduled Alarms:', alarms);
    alarms.forEach((alarm) => {
      console.log(`Alarm Name: ${alarm.name}`);
      console.log(`Scheduled Time: ${new Date(alarm.scheduledTime)}`);
      if (alarm.periodInMinutes) {
        console.log(`Repeats every ${alarm.periodInMinutes} minutes`);
      }
    });
  });
  