const playSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M4 3.532l14.113 8.468-14.113 8.468v-16.936zm-2-3.532v24l20-12-20-12z"/></svg>'
const stopSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24z"/></svg>'

/**
 * Convert task to timer
 * @param { HTMLElement } task
 * @returns { HTMLElement }
 */
export const convertTask = task => {
    const leftControl = task.querySelector('.left-control')
    leftControl.innerHTML = playSvg
    const svgMinusDiv = task.querySelector('.right-control')
    svgMinusDiv.innerHTML = stopSvg

    const left = task.querySelector('.left-control')
    left.onclick = () => console.log('Pause timer')
    return task
}
