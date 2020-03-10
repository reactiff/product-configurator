import React from 'react'
import { useState, useEffect } from 'react'
import { DateUtil } from '../../shared/Util'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Mpg from './Mpg'
import getPeriodTitle, {getMonthName} from './periodselector/getPeriodTitle'

import './css/periodselector.css'

const VIEW_NAME = 'schedule-period'
export default (props) => {

    const today = DateUtil.today()
  
    //const storedPeriod = localStorage.getItem(VIEW_NAME) || 'w'
    const storedPeriod = 'd'; // TODO implement week and month views
  
    const [period, setPeriod] = useState(storedPeriod);
    const [cursor, setCursor] = useState(today)

    const [weekDates, setWeekDates] = useState([]);

    const yyyymmdd = DateUtil.toYYYYMMDD(cursor)

    const locals = {
        today,
        period,
        cursor,
        yyyymmdd,
        weekDates,
    };

    useEffect(() => {

        const weekLimits = DateUtil.getPeriod(cursor, 'w');
        const weekDates = DateUtil.getDateRange(...weekLimits);
        setWeekDates(weekDates);

        const limits = DateUtil.getPeriod(cursor, period);
        const dates = DateUtil.getDateRange(...limits);
        
        if(props.onChange){
            props.onChange(dates, cursor);
        }
        
    }, [yyyymmdd, period]);

    const navigatePeriod = (step) => {
        let newCursor = null
        switch(period){
            case 'd':
                newCursor = DateUtil.addDays(cursor, step)
                break;
            case 'm':
                let y = cursor.getFullYear()
                let m = cursor.getMonth() + step
                let d = cursor.getDate()
                if(m > 11){
                    m = 0
                    y++
                }
                else if(m < 0){
                    m = 11
                    y--
                }

                newCursor = new Date(y, m, d)

                while (!DateUtil.isDate(newCursor)) 
                {
                    //e.g. stepping back 1 month from March 31 will land on February 31 which is not a valid date, so need to subtract a day until its valid
                    //or stepping forward from January 31, step back needed as well
                    //obviously this can only happen at end of the month where month ends are jagged
                    
                    newCursor = new Date(y, m, --d)
                } 
                

                break;
            default:
                newCursor = DateUtil.addDays(cursor, step * 7) //week
                break;
                
        }
        setCursor(newCursor)
    }

    const handleSetPeriod = (key) => {
        setPeriod(key)
        setCursor(DateUtil.today()) //reset it to today
        localStorage.setItem(VIEW_NAME, key)
    }
    
    const selectedDayDisplay = <Mpg.div textAlign="center">
        {DateUtil.getWeekday(cursor)},&nbsp;
        {getMonthName(cursor)}&nbsp;
        {cursor.getDate()},&nbsp;
        {cursor.getFullYear()}
    </Mpg.div>

    return (

        <>

            {/* PERIOD SELECTOR */}
            <Mpg.Flex row noMargin alignItems="center" justifyContent="center">

                <Mpg.div>
                    <Button variant="link" onClick={() => navigatePeriod(-1)}>
                        <Mpg.FontAwesomeIcon size="2x" icon="arrow-alt-circle-left"/>
                    </Button>
                </Mpg.div>

                <Mpg.div grow>
                    <Mpg.Flex row justifyContent="center" tight>
                        {/* <ButtonToolbar>
                            <ToggleButtonGroup type="radio" name="period" value={period} onChange={handleSetPeriod}>
                                <ToggleButton size="sm" value={'d'}>Day</ToggleButton>
                                <ToggleButton size="sm" value={'w'}>Week</ToggleButton>
                                <ToggleButton size="sm" value={'m'}>Month</ToggleButton>
                            </ToggleButtonGroup>
                        </ButtonToolbar> */}
                        {selectedDayDisplay}
                    </Mpg.Flex>
                </Mpg.div>

                <Mpg.div>
                    <Button variant="link" onClick={() => navigatePeriod(1)}>
                        <Mpg.FontAwesomeIcon size="2x" icon="arrow-alt-circle-right"/>
                    </Button>
                </Mpg.div>

            </Mpg.Flex>
            
            {/* WHILE PERIOD SELECTOR IS DISABLED */}
            {/* <Mpg.Flex fullWidth row alignItems="center" justifyContent="flex-start" className="light-stripe" noMargin padding="5px 0px 0px 10px">
                <h2>
                    {getPeriodTitle(period, today, cursor)}
                </h2>
            </Mpg.Flex> */}

                
            {
                period === 'd' &&
                <>
                    <Mpg.Flex row noMargin textAlign="center" justifyContent="center" alignItems="center">
                        {
                            weekDates.map((d,i) => {

                                const letter = DateUtil.getWeekday(d);

                                const isToday = DateUtil.toYYYYMMDD(d) === DateUtil.toYYYYMMDD(today);
                                const isSelected = DateUtil.toYYYYMMDD(d) === DateUtil.toYYYYMMDD(cursor);
                                const classes = ['selector'];
                                if(isToday){
                                    classes.push('today')
                                }
                                if(isSelected){
                                    classes.push('selected')
                                }
                                return <Mpg.Flex tight column grow key={i} className="week-day-strip">
                                    <Mpg.div smaller>{letter[0]}</Mpg.div>
                                    <Mpg.Flex tight row justifyContent="center">
                                        <Mpg.Flex className={classes.join(' ')}>
                                            <strong>{d.getDate()}</strong>
                                        </Mpg.Flex>
                                    </Mpg.Flex>
                                    
                                </Mpg.Flex>

                            })
                        }
                    </Mpg.Flex>
                </>
            }
        </>
    )
}
