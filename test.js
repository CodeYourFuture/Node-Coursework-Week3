const moment=require('moment')

console.log(moment()
    );



    let checkDiff = (InDate, OutDate) => {
        const checkInDate = moment(InDate, "YYYY-MM-DD");
        const checkOutDate = moment(OutDate, "YYYY-MM-DD");
        const diff = checkOutDate.diff(checkInDate, "days");
        return diff;
      };
      console.log(checkDiff('2020-09-06','2021-09-06'));


      console.log(![])