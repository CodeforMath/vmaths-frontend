export const calculateExamResult = (questions, userAnswers) => {
  let totalPoints = 0;
  let correctCount = 0;

  questions.forEach((q, i) => {
    const userAns = userAnswers[i];
    let dbAns = q.correctAnswer;
    if (userAns === undefined || userAns === null) return;

    let isCorrect = false;

    // Logic kiểm tra đáp án (Bóc từ useMemo của bác ra)
    if (q.type === 'true_false') {
      let normalizedDbAns = dbAns;
      if (typeof dbAns === 'string') {
        try {
          normalizedDbAns = dbAns.replace(/[\[\]\s]/g, '').split(',')
            .map(v => v.toLowerCase() === 'true' || v.toLowerCase() === 't');
        } catch (e) { normalizedDbAns = []; }
      }
      if (Array.isArray(userAns) && Array.isArray(normalizedDbAns)) {
        isCorrect = userAns.length === normalizedDbAns.length && 
                    userAns.every((val, idx) => val === normalizedDbAns[idx]);
      }
    } else if (q.type === 'multiple_choice') {
      isCorrect = Number(userAns) === Number(dbAns);
    } else {
      isCorrect = String(userAns).trim().toLowerCase() === String(dbAns).trim().toLowerCase();
    }

    if (isCorrect) {
      correctCount += 1;
      // Hệ số điểm bác quy định
      if (q.type === 'multiple_choice') totalPoints += 0.25;
      else if (q.type === 'true_false') totalPoints += 1.0;
      else if (q.type === 'short_answer') totalPoints += 0.5;
      else totalPoints += 1.0;
    }
  });

  return {
    points: parseFloat(totalPoints.toFixed(2)),
    correctCount
  };
};

// Hàm bổ trợ format thời gian
export const formatTimeStr = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};