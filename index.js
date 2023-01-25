import axios from 'axios';
import CryptoJS from 'crypto-js';

const accessKey = ''
const secretKey = ''
const instanceNo = ''; 


Date.prototype.toYYYYMMddHHmm = function() {
    return `${this.getFullYear()}${(this.getMonth() + 1).toString().padStart(2, '0')}${this.getDate().toString().padStart(2, '0')}${this.getHours().toString().padStart(2, '0')}${this.getMinutes().toString().padStart(2, '0')}`
}

async function requestCdnList() {
    const url = 'https://ncloud.apigw.ntruss.com/cdn/v2/getCdnPlusInstanceList?responseFormatType=JSON'
    const path = '/cdn/v2/getCdnPlusInstanceList?responseFormatType=JSON'
    const timestamp = `${new Date().getTime()}`;
    const signature = makeSignature('GET', path, timestamp, accessKey, secretKey);
    const response = await axios.get(url, {
        headers: {
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-signature-v2': signature,
            'x-ncp-apigw-timestamp': timestamp,
        }
    });
    console.log(JSON.stringify(response.data));
}

async function requestCdnTodayMonit(instanceNo) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const startDateStr = startDate.toYYYYMMddHHmm();
    const endDateStr = endDate.toYYYYMMddHHmm();
    const path = `/cdn/v2/getCdnPlusMonitoringData?cdnInstanceNoList.1=${instanceNo}&endDate=${endDateStr}&startDate=${startDateStr}&responseFormatType=JSON`
    const url = `https://ncloud.apigw.ntruss.com${path}`
    const timestamp = `${new Date().getTime()}`;
    const signature = makeSignature('GET', path, timestamp, accessKey, secretKey);
    const response = await axios.get(url, {
        headers: {
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-signature-v2': signature,
            'x-ncp-apigw-timestamp': timestamp,
        }
    });
    
    console.log(`Today ${startDateStr}~${endDateStr}`)    
    // console.log(JSON.stringify(response.data));
    console.log('Today total', response?.data?.getCdnPlusMonitoringDataResponse?.totalRequest)
    console.log('Today twoxxOriginHitsDataRecordList', response?.data?.getCdnPlusMonitoringDataResponse?.twoxxOriginHitsDataRecordList.reduce((acc, cur) => acc + cur[1], 0))
    console.log('Today totalTwoxxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalTwoxxOriginHits)
    console.log('Today totalThreexxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalThreexxOriginHits)
    console.log('Today totalFourxxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalFourxxOriginHits)
    console.log('Today totalFivexxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalFivexxOriginHits)
    console.log('Today totalFivexxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalFivexxOriginHits)
    console.log('Today totalFivexxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalFivexxOriginHits)
    console.log('Today totalFivexxOriginHits', response?.data?.getCdnPlusMonitoringDataResponse?.totalFivexxOriginHits)
    console.log('Today twoxxEdgeHitsDataRecordList', response?.data?.getCdnPlusMonitoringDataResponse?.twoxxEdgeHitsDataRecordList.reduce((acc, cur) => acc + cur[1], 0))
    console.log('Today threexxEdgeHitsDataRecordList', response?.data?.getCdnPlusMonitoringDataResponse?.threexxEdgeHitsDataRecordList.reduce((acc, cur) => acc + cur[1], 0))
    console.log('Today fourxxEdgeHitsDataRecordList', response?.data?.getCdnPlusMonitoringDataResponse?.fourxxEdgeHitsDataRecordList.reduce((acc, cur) => acc + cur[1], 0))
    console.log('Today fivexxEdgeHitsDataRecordList', response?.data?.getCdnPlusMonitoringDataResponse?.fivexxEdgeHitsDataRecordList.reduce((acc, cur) => acc + cur[1], 0))
}

async function requestCdnSomeMinuteMonit(minute, instanceNo) {
    const diffMillis = minute * 1000 * 60;
    const now = new Date();
    const startDate = new Date(now.getTime() - diffMillis);
    const endDate = new Date();
    const startDateStr = startDate.toYYYYMMddHHmm();
    const endDateStr = endDate.toYYYYMMddHHmm();
    const path = `/cdn/v2/getCdnPlusMonitoringData?cdnInstanceNoList.1=${instanceNo}&endDate=${endDateStr}&startDate=${startDateStr}&responseFormatType=JSON`
    const url = `https://ncloud.apigw.ntruss.com${path}`
    const timestamp = `${new Date().getTime()}`;
    const signature = makeSignature('GET', path, timestamp, accessKey, secretKey);
    const response = await axios.get(url, {
        headers: {
            'x-ncp-iam-access-key': accessKey,
            'x-ncp-apigw-signature-v2': signature,
            'x-ncp-apigw-timestamp': timestamp,
        }
    });
    
    // console.log(JSON.stringify(response.data));
    console.log(`${minute} Minute totalRequest ${startDateStr}~${endDateStr}`, response?.data?.getCdnPlusMonitoringDataResponse?.totalRequest)
}


function makeSignature(method, url, timestamp, accessKey, secretKey) {
	var space = " ";				// one space
	var newLine = "\n";				// new line
	var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
	hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

	var hash = hmac.finalize();

    const signature = hash.toString(CryptoJS.enc.Base64);
    // console.log(timestamp, signature);
	return signature;
}

// requestCdnList();
requestCdnTodayMonit(instanceNo);
requestCdnSomeMinuteMonit(10, instanceNo);