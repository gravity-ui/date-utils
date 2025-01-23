import {setLocaleOptions} from '../src/locale/localeOptions';
function plural(forms: string[], num: number) {
    const rem10 = num % 10;
    const rem100 = num % 100;
    if (rem10 === 1 && rem100 !== 11) {
        return forms[0];
    }
    if (rem10 >= 2 && rem10 <= 4 && (rem100 < 10 || rem100 >= 20)) {
        return forms[1];
    }
    return forms[2];
}

function relativeTimeWithPlural(
    number: number,
    withoutSuffix: boolean,
    key: 'ss' | 'm' | 'mm' | 'hh' | 'dd' | 'ww' | 'MM' | 'yy',
) {
    const format = {
        ss: withoutSuffix ? ['секунда', 'секунды', 'секунд'] : ['секунду', 'секунды', 'секунд'],
        mm: withoutSuffix ? ['минута', 'минуты', 'минут'] : ['минуту', 'минуты', 'минут'],
        hh: ['час', 'часа', 'часов'],
        dd: ['день', 'дня', 'дней'],
        ww: ['неделя', 'недели', 'недель'],
        MM: ['месяц', 'месяца', 'месяцев'],
        yy: ['год', 'года', 'лет'],
    };
    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    } else {
        return number + ' ' + plural(format[key], Number(number));
    }
}

setLocaleOptions('ru', {
    longDateFormat: {
        LTS: 'H:mm:ss',
        LT: 'H:mm',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY г.',
        LLL: 'D MMMM YYYY г., H:mm',
        LLLL: 'dddd, D MMMM YYYY г., H:mm',
    },
    relativeTime: {
        future: 'через %s',
        past: '%s назад',
        s: 'несколько секунд',
        m: relativeTimeWithPlural,
        mm: relativeTimeWithPlural,
        h: 'час',
        hh: relativeTimeWithPlural,
        d: 'день',
        dd: relativeTimeWithPlural,
        M: 'месяц',
        MM: relativeTimeWithPlural,
        y: 'год',
        yy: relativeTimeWithPlural,
    },
    ordinal: function (
        n: number,
        unit: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
    ) {
        switch (unit) {
            case 'date':
                return n + '-го';
            case 'weekNumber':
                return `${n}-я`;
            default:
                return `${n}-й`;
        }
    },
    ordinalParseUnit: (
        token: 'date' | 'weekday' | 'dayOfYear' | 'weekNumber' | 'month' | 'quarter',
    ) => {
        return {
            token,
            regex: /(\d{1,2})-(й|го|я)/,
            deserialize: ([, s]) => Number(s),
        };
    },
});
