export function getFileDate(timestamp : number) : string {

  const date = new Date(timestamp*1000)
  const seconds = date.getSeconds() < 10? '0'+date.getSeconds() : date.getSeconds();
  const minutes = date.getMinutes() <10? '0' + date.getMinutes() : date.getMinutes();
  const timeString = date.getHours() > 12 ? date.getHours() - 12 + ':'+minutes+':'+seconds + ' PM' :
      date.getHours() + ':'+minutes+':'+seconds + ' AM'
  return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()+', ' + timeString;
}
