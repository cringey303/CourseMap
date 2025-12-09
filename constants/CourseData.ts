export const HOCR_COURSE = [
    { latitude: 42.35254089339125, longitude: -71.10770526494954 }, // Start
    { latitude: 42.35282352309642, longitude: -71.11221262493716 },
    { latitude: 42.353590654459936, longitude: -71.11423410759794 },
    { latitude: 42.35494320537049, longitude: -71.11647412892526 },
    { latitude: 42.356780205513644, longitude: -71.1169931582567 },
    { latitude: 42.360655552464124, longitude: -71.11671577982904 },
    { latitude: 42.36642945866632, longitude: -71.11689138338436 },
    { latitude: 42.368375599605855, longitude: -71.11798890560215 },
    { latitude: 42.368894560340294, longitude: -71.1204034544829 },
    { latitude: 42.368838493806436, longitude: -71.12274166802126 },
    { latitude: 42.369264331058446, longitude: -71.12376140884847 },
    { latitude: 42.37077111661384, longitude: -71.12531318836866 },
    { latitude: 42.372277866024206, longitude: -71.1262442560806 },
    { latitude: 42.37316224558282, longitude: -71.12744134313907 },
    { latitude: 42.37375182503732, longitude: -71.12881577642878 },
    { latitude: 42.37385008774109, longitude: -71.1306335752947 },
    { latitude: 42.37342428157902, longitude: -71.1322740279301 },
    { latitude: 42.37263817031061, longitude: -71.13316075908483 },
    { latitude: 42.371753783372526, longitude: -71.13302774941158 },
    { latitude: 42.370738360790796, longitude: -71.13205234514159 },
    { latitude: 42.36936260078295, longitude: -71.13209668169962 },
    { latitude: 42.3682034311349, longitude: -71.1335121513824 },
    { latitude: 42.367139015596706, longitude: -71.13599605845279 }, // Finish
];

// Helper: Haversine Formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Main function to get total course length
export function calculateCourseLength(course: { latitude: number; longitude: number }[]) {
    let totalDistance = 0;
    for (let i = 0; i < course.length - 1; i++) {
        totalDistance += getDistanceFromLatLonInKm(
            course[i].latitude,
            course[i].longitude,
            course[i + 1].latitude,
            course[i + 1].longitude
        );
    }
    return totalDistance.toFixed(2); // Returns string like "4.82"
}
