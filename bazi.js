const lunar = require("@tony801015/chinese-lunar");

module.exports = (req, res) => {
  const { year, month, day, hour } = req.query;

  if (!year || !month || !day || !hour) {
    return res.status(400).json({ error: "請提供完整的年月日時" });
  }

  const data = lunar(year, month, day).setTime(hour).getJson();

  res.status(200).json({
    yearPillar: data.chineseYear,
    monthPillar: data.chineseMonth,
    dayPillar: data.chineseDay,
    hourPillar: data.chineseTime,
    fiveElements: data.fiveElement,
    tenGods: data.chineseYearTenGod,
    nayin: data.nayin
  });
};
