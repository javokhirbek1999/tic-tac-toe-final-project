import React, { useEffect, useState } from 'react'
import { useSpring, animated, config } from 'react-spring';
import { useDispatch, useSelector } from 'react-redux';
import { incrementPlayer1, incrementPlayer2, resetScores } from '../scoreSlice';
import { Close, RadioButtonUnchecked } from '@mui/icons-material';
import "./TicTacToe.css";


function TicTacToe() {

    const [cells, setCells] =  useState(Array(9).fill(""));
    const [turn, setTurn] = useState('O');
    const [winner, setWinner] = useState();
    const [isDraw, setIsDraw] = useState(false);
    const [zoomIn, setZoomIn] = useState(false);

    const [cellProps, setCellProps] = useSpring(() => ({
        from: { opacity: 0, transform: 'scale(0.5)' },
        to: { opacity: 1, transform: 'scale(1)' },
        reset: true,
        config: config.gentle,
    }));   

    

    useEffect(() => {
        setCellProps.start({
            from: { opacity: 0, transform: 'scale(0.5)' },
            to: { opacity: 1, transform: 'scale(1)' },
            reset: true,
            config: config.gentle,
        })
        if (winner || isDraw) {
            setCellProps.start({reset: false})
            setZoomIn(true);

            // Reset zoom effect after a short delay
            const timeout = setTimeout(() => {
                setZoomIn(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [winner, isDraw]);

    // Animation for Reset Board button
    const resetBoardButtonProps = useSpring({
        opacity: winner || isDraw ? 1 : 0.5,
        transform: winner || isDraw ? 'scale(1)' : 'scale(0.8)',
        cursor: winner || isDraw ? 'pointer' : 'not-allowed',
        config: config.gentle,
    });

    // Animation for Reset Scores button
    const resetScoresButtonProps = useSpring({
        opacity: winner || isDraw ? 1 : 0.5,
        transform: winner || isDraw ? 'scale(1)' : 'scale(0.8)',
        cursor: winner || isDraw ? 'pointer' : 'not-allowed',
        config: config.gentle,
    });

     // Animation for disabled buttons
    const disabledButtonProps = useSpring({
        from: { opacity: 0, transform: 'scale(0.8)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: config.gentle,
    });

    // Animation for Player X scores
    const playerXProps = useSpring({
        from: { opacity: 0, transform: 'translateX(-20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
        config: config.gentle,
      });
    
    // Animation for Player O scores
    const playerOProps = useSpring({
        from: { opacity: 0, transform: 'translateX(20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
        config: config.gentle,
    });

    const zoomInProps = useSpring({
        transform: zoomIn ? 'scale(1.2)' : 'scale(1)',
        config: config.gentle,
    });
        

    const calculateWinner = (arr) => {
        let combos = {
            across: [
                [0,1,2],
                [3,4,5],
                [6,7,8]
            ],
            down: [
                [0,3,6],
                [1,4,7],
                [2,5,8]
            ],
            diagonal: [
                [0,4,8],
                [2,4,6]
            ]
        }

        for (let combo in combos) {
            combos[combo].forEach((pattern) => {
              if (
                arr[pattern[0]] === "" ||
                arr[pattern[1]] === "" ||
                arr[pattern[2]] === ""
              ) {
              } else if (
                arr[pattern[0]] === arr[pattern[1]] &&
                arr[pattern[1]] === arr[pattern[2]]
              ) {
                setWinner(arr[pattern[0]]);

                if (arr[pattern[0]] === 'X') {
                    dispatch(incrementPlayer1())
                } else {
                    dispatch(incrementPlayer2())
                }
              }
            });
        }
    }

    const handleClick = (cellNum) => {
        if (winner || cells[cellNum] !== "") return;

        let arr = [...cells];
        if (turn === "X") {
            arr[cellNum] = "X";
            setTurn("O");
        } else {
            arr[cellNum] = "O";
            setTurn("X");
        }

        calculateWinner(arr);
        
        setCells(arr);
        
        if (!arr.includes("") && !winner) {
            setIsDraw(true);
        }

    }

    const Cell = ({ num }) => {
        const cellValue = cells[num];
        const cellClassName = cellValue ? `cell cell-${cellValue}` : "cell";


        return (
            <animated.td 
            className={cellClassName} 
            onClick={() => handleClick(num)}
            style={cellProps}
            >
                {cellValue === 'X' ? <Close fontSize="large" /> : cellValue === 'O' ? <RadioButtonUnchecked fontSize="large" /> : null}
            </animated.td>
        );
    };
    
    const handleResetBoard = () => {
        setWinner();
        setIsDraw(false);
        setCells(Array(9).fill(""));
        setTurn("O")
    };

    const handleReset = () => {
        setWinner();
        setIsDraw(false);
        setCells(Array(9).fill(""));
        dispatch(resetScores())
        setTurn("O")
    };


    const dispatch = useDispatch()

    const player1Score = useSelector(state => state.scores.player1)
    const player2Score = useSelector(state => state.scores.player2)

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <animated.h2 style={playerXProps}>Player X: {player1Score}</animated.h2>
                <animated.h2 style={playerOProps}>Player O: {player2Score}</animated.h2>
            </div>
        <div className='container'>
            <div className={`winner ${winner || isDraw ? "show" : ""}`}>
                {winner ? `Winner is: ${winner}` : isDraw ? "It is a draw" : ""}
            </div>
            <table>
                <tbody>
                    <tr>
                        <Cell num={0} />
                        <Cell num={1} />
                        <Cell num={2} />
                    </tr>
                    <tr>
                        <Cell num={3} />
                        <Cell num={4} />
                        <Cell num={5} />
                    </tr>
                    <tr>
                        <Cell num={6} />
                        <Cell num={7} />
                        <Cell num={8} />
                    </tr>
                </tbody>
            </table>

            <div style={{flexDirection: 'row', flex: 1}}>

                <animated.button
                    style={{ ...resetBoardButtonProps, ...disabledButtonProps, ...zoomInProps, marginRight: '10px', backgroundColor: winner || isDraw ? 'blue' : 'gray' }}
                    className='reset-button'
                    disabled={!winner && !isDraw}
                    onClick={handleResetBoard}
                >
                    Reset Board
                </animated.button>

                <animated.button
                    style={{ ...resetScoresButtonProps, ...disabledButtonProps, ...zoomInProps, marginRight: '10px', backgroundColor: winner || isDraw ? 'blue' : 'gray' }}
                    className='reset-button'
                    disabled={!winner && !isDraw}
                    onClick={handleReset}
                >
                    Reset Scores
                </animated.button>

            </div>

        </div>
        </>
    )
}

export default TicTacToe
