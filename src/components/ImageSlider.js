import React from 'react'
import {useRef} from 'react'
import sliderData from './sliderData'


window.oncontextmenu = function (e) {
    e.preventDefault()
    e.stopPropagation()
    return false
}

export default function ImageSlider() {
    const slider = useRef(null)

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        // animationID= 0,
        currentInd = 0;


// event handlers
    // moving slider by clicking on dot
    function clickMove(e) {
        const elem = e.target
        currentInd = parseInt(elem.dataset.ind)
        currentTranslate = currentInd * -window.innerWidth
        prevTranslate = currentTranslate
        setSliderPosition()

        changeActiveDot(currentInd)
    }

    // select active dot
    function changeActiveDot(currentInd) {
        Array.from(document.querySelectorAll('.dots span'))
            .forEach((item, i) => {
                if (i === currentInd) return item.classList.add('active-dot')
                return item.classList.remove('active-dot')
            })
    }

    // checking the beginning of swipe (or drag)
    function touchStart(index) {
        return function (event) {
            currentInd = index
            startPos = getPosX(event)
            isDragging = true
            slider.current.classList.add('grabbing')
        }
    }

    // performing slider moving
    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPosX(event)
            currentTranslate = prevTranslate + currentPosition - startPos
        }
    }

    // checking the end of swipe (or drag) and finally move slider
    function touchEnd() {
        isDragging = false

        const movedBy = currentTranslate - prevTranslate
        if (movedBy < -100 && currentInd < sliderData.length - 1) {
            currentInd++
        }
        if (movedBy > 100 && currentInd > 0) {
            currentInd--
        }

        setPositionByInd()
        slider.current.classList.remove('grabbing')

        changeActiveDot(currentInd)
    }

// utils functions
    // checking event coords depending on device
    function getPosX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
    }

    function setSliderPosition() {
        slider.current.style.transform = `translateX(${currentTranslate}px)`
    }

    // setting new position (and moving)
    function setPositionByInd() {
        currentTranslate = currentInd * -window.innerWidth
        prevTranslate = currentTranslate
        setSliderPosition()
    }

// JSX
    return (
        <div className="outer">
            <div className="text">
                <h2>React Carousel</h2>
            </div>
            <div className="slider-container" ref={slider}>

                {sliderData.map((slide, index) => {
                    return <div key={index} className="slide"
                                onMouseDown={touchStart(index)}
                                onMouseUp={touchEnd}
                                onTouchStart={touchStart(index)}
                                onTouchEnd={touchEnd}
                                onMouseLeave={touchEnd}
                                onMouseMove={touchMove}
                                onTouchMove={touchMove}
                    >

                        <img
                            onDragStart={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                return false
                            }}
                            src={slide.img} alt="picture"/>
                    </div>
                })}
            </div>
            <div className="dots">
                {
                    sliderData.map((el, i) => {
                        return <span key={i} data-ind={i} onClick={clickMove}></span>
                    })
                }
            </div>
        </div>
    )
}
