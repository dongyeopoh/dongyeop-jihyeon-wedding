/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { format, differenceInSeconds, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import styled from '@emotion/styled';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const MonthTitle = styled.h3`
  font-size: 22px;
  color: #666;
  margin-bottom: 20px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
`;

const Day = styled.div`
  padding: 10px;
  background-color: ${props => (props.isFixedDate ? 'red' : 'transparent')};
  color: ${props => (props.isFixedDate ? 'white' : props.isSunday ? 'red' : '#333')};
  border-radius: ${props => (props.isFixedDate ? '50%' : '0')};
  text-align: center;
  font-weight: ${props => (props.isFixedDate ? 'bold' : 'normal')};
`;

const WeekdayHeader = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 10px;
  color: ${props => (props.isSunday ? 'red' : '#333')};
`;

const ResultText = styled.p`
  font-family: HSSanTokki20-Regular, serif;
  font-size: 18px;
  font-weight: 400;
  color: ${props => (props.dday < 0 ? '#d48380' : '#83cee5')};
  margin: 30px 0;
`;

const Calendar = () => {
  // 고정된 날짜 설정 (2024년 11월 2일 오후 12시)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fixedDate = new Date('2024-11-02T12:00:00');
  const [secondsLeft, setSecondsLeft] = useState(null);
//   const today = new Date();  // 현재 시간은 오늘을 기준으로 사용
  const displayMonth = new Date(2024, 10);  // 2024년 11월 고정 (0-indexed, 10 = November)

  // 11월 첫 날과 마지막 날
  const startOfDisplayMonth = startOfMonth(displayMonth);
  const endOfDisplayMonth = endOfMonth(displayMonth);

  // 해당 달의 모든 날짜 리스트
  const daysInMonth = eachDayOfInterval({ start: startOfDisplayMonth, end: endOfDisplayMonth });

  // 첫 날이 월요일부터 시작하도록 보정 (날짜 이동)
  const firstDayOfMonth = getDay(startOfDisplayMonth); // 해당 달의 첫째 날의 요일 (0: 일요일, 1: 월요일, ...)
  const paddingDays = (firstDayOfMonth + 6) % 7; // 월요일 시작을 위해 1일이 금요일이면 빈칸 5개

  const paddedDays = [
    ...Array(paddingDays).fill(null),  // 앞에 패딩할 빈 칸 채우기
    ...daysInMonth
  ];

  // 초 단위로 남은 시간 계산
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const seconds = differenceInSeconds(fixedDate, now);
      setSecondsLeft(seconds);
    }, 1000); // 1초마다 갱신

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 제거
  }, [fixedDate]);

  // 남은 시간 계산 (일, 시간, 분, 초)
  const getTimeLeft = (totalSeconds) => {
    
    const absTotalSeconds = Math.abs(totalSeconds);  // totalSeconds의 절대값을 구함
    const days = Math.floor(absTotalSeconds / (24 * 60 * 60));
    const hours = Math.floor((absTotalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((absTotalSeconds % 3600) / 60);
    const seconds = absTotalSeconds % 60;

    return totalSeconds > 0
        ? `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남았습니다.`
        : `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 지났습니다.`;
  };

  return (
    <CalendarContainer>
      <MonthTitle>{format(displayMonth, 'MMMM yyyy')}</MonthTitle>

      {/* 요일 헤더 추가 */}
      <CalendarGrid>
        {['월', '화', '수', '목', '금', '토', '일'].map((weekday, index) => (
          <WeekdayHeader key={index} isSunday={index === 6}>
            {weekday}
          </WeekdayHeader>
        ))}

        {/* 달력 날짜 렌더링 */}
        {paddedDays.map((day, index) => (
          <Day 
            key={index} 
            isSunday={getDay(day) === 0} // 일요일이면 빨간색
            isFixedDate={day && isSameDay(day, fixedDate)} // 고정된 날짜이면 빨간 원과 흰 글자
          >
            {day ? format(day, 'd') : ''} {/* 날짜가 있으면 표시, 패딩은 빈칸 */}
          </Day>
        ))}
      </CalendarGrid>

      <ResultText>
        {secondsLeft !== null ? `D-Day: ${getTimeLeft(secondsLeft)}` : '로딩 중...'}
      </ResultText>
    </CalendarContainer>
  );
};

export default Calendar;
