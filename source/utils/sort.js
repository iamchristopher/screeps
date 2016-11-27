export function byPreference (preferences) {
    return (a, b) => {
        const x = preferences.indexOf(a.structureType);
        const y = preferences.indexOf(b.structureType);

        if (y < 0) {
            return -1;
        }

        if (x < 0) {
            return 1;
        }

        if (x > y) {
            return 1;
        }

        if (y > x) {
            return -1;
        }

        return 0;
    };
}

export function byProgress (a, b) {
    if (a.progress < b.progress) {
        return 1;
    }

    if (a.progress > b.progress) {
        return -1;
    }

    return 0;
}
