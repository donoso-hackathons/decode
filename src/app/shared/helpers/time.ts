
export function pad(n:any) {
  return n < 10 ? '0' + n : n;
}

export const pad5 = (n:any) => {
  const str = ("0000" + n)
  return str.slice(str.length-5, str.length)
}

export const convertDateToString = (date: Date): string => {
  const dateDay = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return year + '-' + pad((month + 1)) + '-' + pad(dateDay);
};

export const convertDateToTimeString = (date: Date): string => {
  let dateHours = date.getHours();
  const dateMin = date.getMinutes();
  let dateString = '';
  if (dateHours >= 12) {
    dateHours = dateHours - 12;
    dateString = ' pm';
  } else  {
    dateString = ' am';
  }
  return  pad(dateHours) + ':' + pad(dateMin) + dateString;
};

export const convertDateToTimeString24 = (date: Date): string => {
  const dateHours = date.getHours();
  const dateMin = date.getMinutes();

  return  pad(dateHours) + ':' + pad(dateMin) ;
};

export const convertDateToNiceString = (date: Date): string => {
  const dateDay = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return  pad(dateDay)  + '-' + pad((month + 1)) + '-' + year;

};




export const convertNiceStringToDate = (date: string) => {
  const splitDate = date.split('-');
  return new Date(+splitDate[0], +splitDate[1] - 1, +splitDate[2]);
};

export const convertNiceStringToMs = (date: string) => {
  const splitDate = date.split('-');
  return new Date(+splitDate[0], +splitDate[1] - 1, +splitDate[2],12,0,0).getTime();
};

// export const convertLocalStringtoNiceString = (date: string) => {

//   const splitDate = date.split('/');
//   return  splitDate[1] + "-" + pad(splitDate[0]) + "-" + splitDate[2];
// };

export const convertStringToNiceString = (date: string) => {
  const splitDate = date.split('-');
  return  splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
};

export const convertDateToActiveMonth = (date: Date) : string => {
  const month = (date.getMonth() + 1);
  const year = date.getFullYear().toString();
  const activeMonth = year + "-" + pad(month);
  return activeMonth;
}


export const convertActiveMonthToDate = (date:string) => {
  const splitDate = date.split('-');
  const initMonth = new Date(+splitDate[0], +splitDate[1] - 1)
    const  initNextMonth = new Date(+splitDate[0], +splitDate[1] - 1)
    initNextMonth.setMonth(initNextMonth.getMonth()+1)

  const obj = {
     initMonth,
    initNextMonth
  }
  return obj;
}

export const convertMstoHours = (diffIn: number): number => {
  let diff = diffIn;
  const ms = diff % 1000;
  diff = (diff - ms) / 1000;
  const ss = diff % 60;
  diff = (diff - ss) / 60;
  const mm = diff % 60;
  diff = (diff - mm) / 60;
  const hh = (diff % 24) + (mm / 60);
  return  hh;
};


export const convertMstoNiceString = (ms: number): string => {

  return  convertDateToNiceString(new Date(ms));

};

export const convertMstoTimeString = (ms: number): string => {

  const date = new Date(ms);

  return `${date.getHours()}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

};

export const convertMstoHoursText = (diffIn: number): string => {
  let diff = diffIn;
  let positive = true
  if (diff <0) {
    positive = false;
    diff = Math.abs(diff)
  }

  const ms = diff % 1000;
  diff = (diff - ms) / 1000;
  const ss = diff % 60;
  diff = (diff - ss) / 60;
  const mm = diff % 60;
  diff = (diff - mm) / 60;
  const hh = diff;
  if (positive) {
    return  `${pad(Math.abs(hh))}:${pad(Math.abs(mm))}:${pad(Math.abs(ss))} `;
  } else {
    return  `-${pad(Math.abs(hh))}:${pad(Math.abs(mm))}:${pad(Math.abs(ss))} `;
  }


};

export const convertMstoHoursMins = (diffIn: number): string => {
  let diff = diffIn;
  let positive = true
  if (diff <0) {
    positive = false;
    diff = Math.abs(diff)
  }

  const ms = diff % 1000;

  diff = (diff - ms) / 1000;
  const ss = diff % 60;
  diff = (diff - ss) / 60;

  const mm = diff % 60;

  diff = (diff - mm) / 60;
  const hh = diff  //% 24;
  //diff = (diff - hh)

  if (positive) {
    return  `${pad(Math.abs(hh))}:${pad(Math.abs(mm))}`;
  } else {
    return  `-${pad(Math.abs(hh))}:${pad(Math.abs(mm))}`;
  }

};

export const calculateDayStartEndMs = (date:string): {start: number, end:number} => {
  const splitDate = date.split('/');
  const start = new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0],0,0,0).getTime();
  const end = start + ( 24 * (60 * 60 * 1000)) - 1

  return { start: start, end };
}

export const calculateWeekStartEndMS = (date:Date):{start: number, end:number} => {

  const daynr = date.getDate();
  const daynr_week = date.getDay() // === 0 ?  7 : date.getDay();
  const start  = new Date(date.getFullYear(),date.getMonth(), daynr - (daynr_week - 1 ),0,0,0)
  const end = start.getTime() + ( 7 * 24 * (60 * 60 * 1000)) - 1
  return { start: start.getTime(), end };
}

export const convertDateToCW = (sourceDate: Date): number => {
  const date = new Date(sourceDate)

  date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                          - 3 + (week1.getDay() + 6) % 7) / 7);
};

export const convertCWToDate = (cw:any , year:any): {start:number, end: number}  => {

  const date = new Date(year, 0, (1 + (cw - 1) * 7)); // Elle's method
  date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
  return {start: date.getTime() , end:date.getTime() - 1 + 7 * 24 * 60 *60 *1000}
}

export const convertQueryStringToObject = (queryString:string) => {
      const params:any = {};

    // Split into key/value pairs
      const  queries = queryString.split("&");

    // Convert the array of strings into an object
    for (let i = 0, l = queries.length; i < l; i++ ) {
        const temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
}
