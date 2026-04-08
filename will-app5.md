# will-app5 : Document Classes Usage

## Data Structures

### [PagingSettings](PagingSettings)
| Property | Type | Description |
| --- | --- | --- |
| `[key: string]` | `any` | ข้อมูลการตั้งค่าหน้าเพจแบบยืดหยุ่น |

### [PagingNumberInfo](PagingNumberInfo)
| Property | Type | Description |
| --- | --- | --- |
| `page` | `number` | หมายเลขหน้า |
| `text` | `string` | ข้อความที่จะแสดงบนปุ่ม |
| `css` | `string` | (Optional) CSS class สำหรับปรับแต่งปุ่ม |
| `[key: string]` | `any` | ข้อมูลเพิ่มเติม |

### [PagingOffsetsInfo](PagingOffsetsInfo)
| Property | Type | Description |
| --- | --- | --- |
| `page` | `number` | หน้าปัจจุบัน |
| `rowsPerPage` | `number` | จำนวนรายการต่อหน้า |
| `totalRows` | `number` | จำนวนรายการทั้งหมด |
| `totalPages` | `number` | จำนวนหน้าทั้งหมด |
| `limit` | `number` | ขีดจำกัดในการแสดงผลหน้าแต่ละรอบ |
| `offset` | `number` | ค่าเริ่มต้นของรอบการดึง |
| `rows` | `number` | จำนวนรวมสะสม |
| `orderBy` | `string` | (Optional) ชื่อฟิลด์เรียงลำดับ |
| `orderDir` | `string` | (Optional) ทิศทางการเรียงลำดับ (ASC/DESC) |

---

## Utilities

class สำหรับจัดการค่าพื้นฐาน เช่น วันที่, เวลา, การเปรียบเทียบข้อความ และการแปลงชนิดข้อมูล (Parsing)

### Variables and Values
| Variable | Value | Description |
| --- | --- | --- |
| `NORMAL` | `0` | ค่าคงที่สำหรับรูปแบบปกติ |
| `INTER` | `1` | ค่าคงที่สำหรับรูปแบบอักษรแบบสากล |
| `SHORT` | `0` | ค่าคงที่สำหรับรูปแบบสั้น |
| `LONG` | `1` | ค่าคงที่สำหรับรูปแบบยาว |
| `SHORT_MONTH_ARRAY` | `["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]` | อาเรย์รายเดือนรูปแบบย่อ |
| `LONG_MONTH_ARRAY` | `["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]` | อาเรย์รายเดือนรูปแบบเต็ม |
| `SHORT_WEEK_DAY` | `["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]` | อาเรย์วันในสัปดาห์รูปแบบย่อ |
| `LONG_WEEK_DAY` | `["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]` | อาเรย์วันในสัปดาห์รูปแบบเต็ม |

### Methods

#### getDateNow
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันที่ปัจจุบันหรือวันที่กำหนดในรูปแบบ `dd/MM/yyyy`

#### getTimeNow
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงเวลาปัจจุบันในรูปแบบ `HH:mm:ss`

#### getDateTimeNow
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันเวลาปัจจุบันในรูปแบบ `dd/MM/yyyy HH:mm:ss`

#### getYMD
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันที่ในรูปแบบปี-เดือน-วัน (`yyyy-MM-dd`)

#### getDMY
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันที่ในรูปแบบระบบไทย (`dd/MM/yyyy`)

#### formatDate
- **Parameters:** `now?: Date`, `ymd: boolean = false`
- **Returns:** `string`
จัดรูปแบบวันที่ โดยหากเป็น `ymd` เป็นเท็จ จะคืนค่า `dd/MM/yyyy` และหากเป็นจริงจะส่ง `yyyy-MM-dd`

#### formatTime
- **Parameters:** `now?: Date`
- **Returns:** `string`
จัดรูปแบบเวลาเป็น `HH:mm:ss`

#### formatDateTime
- **Parameters:** `now?: Date`, `ymd: boolean = false`
- **Returns:** `string`
จัดรูปแบบวันเวลา (`dd/MM/yyyy HH:mm:ss` หรือ `yyyy-MM-dd HH:mm:ss`)

#### getHMS
- **Parameters:** `now?: Date`
- **Returns:** `string`
คืนค่าตัวอักษรของเวลาชั่วโมง นาที นาที หากใส่มาเต็มรูปแบบ

#### currentDate
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันที่ในรูปแบบ `yyyy-MM-dd`

#### currentTime
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงเวลาปัจจุบันแบบ `HH:mm:ss`

#### currentDateTime
- **Parameters:** `now?: Date`
- **Returns:** `string`
ดึงวันและเวลาในรูปแบบ `yyyy-MM-dd HH:mm:ss`

#### currentTimeMillis
- **Parameters:** `now?: Date`
- **Returns:** `number`
ดึงเวลาในรูปแบบหน่วยเป็นมิลลิวินาที (milli seconds)

#### addDays
- **Parameters:** `days: number`, `date?: Date`
- **Returns:** `Date`
เพิ่มจำนวนวันให้กับค่าวันที่ที่ระบุ

#### compareDate
- **Parameters:** `adate?: Date`, `bdate?: Date`
- **Returns:** `number`
เปรียบเทียบวันที่ โดยละเว้นเวลา (-1 = น้อยกว่า, 0 = เท่ากัน, 1 = มากกว่า)

#### compareTime
- **Parameters:** `adate?: Date`, `bdate?: Date`
- **Returns:** `number`
เปรียบเทียบเวลา (ชั่วโมง, นาที, วินาที)

#### compareDateTime
- **Parameters:** `adate?: Date`, `bdate?: Date`
- **Returns:** `number`
เปรียบเทียบทั้งวันที่และเวลา

#### compareString
- **Parameters:** `astr?: string`, `bstr?: string`
- **Returns:** `number`
เปรียบเทียบข้อความ 2 ข้อความ หากเท่ากันจะคืนค่า 0

#### equalsIgnoreCase
- **Parameters:** `astr?: string`, `bstr?: string`
- **Returns:** `boolean`
ตรวจสอบความเหมือนกันของข้อความทั้ง 2 โดยไม่สนตัวเล็กตัวใหญ่

#### isString
- **Parameters:** `value: any`
- **Returns:** `boolean`
ตรวจสอบว่าชนิดตัวแปรเป็น String หรือไม่

#### hasAttributes
- **Parameters:** `element: unknown`, `attributes: readonly T[]`
- **Returns:** `boolean`
ตรวจสอบว่า `element` ดังกล่าวมี attributes ตามอาเรย์อย่างครบถ้วนหรือไม่

#### parseInteger
- **Parameters:** `dataValue?: any`, `defaultValue?: number`
- **Returns:** `number | undefined`
แปลงค่าเป็นจำนวนเต็ม (ลบจุลภาคออกก่อนการแปลง) หากไม่ได้จะใช้ `defaultValue`

#### parseFloat
- **Parameters:** `dataValue?: any`, `defaultValue?: number`
- **Returns:** `number | undefined`
แปลงค่าเป็นทศนิยม (ลบจุลภาคออก)

#### parseBoolean
- **Parameters:** `dataValue?: any`, `defaultValue?: boolean`
- **Returns:** `boolean | undefined`
แปลงค่าใดๆ หรือตัวอักษร ("true", "false") กลับเป็นค่าความจริงแบบบูลีน

#### parseDate
- **Parameters:** `dataValue?: any`, `defaultValue?: Date`
- **Returns:** `Date | undefined`
แปลงค่าข้อความที่มีรูปแบบหลากหลายของวันที่ (เช่น dd/MM/yyyy HH:mm:ss หรือ yyyy-MM-dd) กลับมาเป็นออบเจกต์ Date

#### parseTime
- **Parameters:** `dataValue?: string`, `defaultValue?: Date`
- **Returns:** `Date | undefined`
แปลงเวลา (HH:mm:ss) ให้อยู่ในคลาสด้านเวลา

#### now
- **Parameters:** (None)
- **Returns:** `Date`
ดึงวันที่ปัจจุบัน (คืนค่าเป็น instance `Date`)

#### translateVariables
- **Parameters:** `template: string`, `variables: any`
- **Returns:** `string`
นำค่าที่อยู่ใน `variables` ไปแทนที่คีย์ใน `template` (ที่มีโครงสร้าง `${key}`)

#### serializeTimestamp
- **Parameters:** `now: Date`, `delimiter?: string`, `includeMillis: boolean = true`
- **Returns:** `string`
สร้างสตริง timestamp เป็นตัวเลขทั้งหมดสำหรับใช้เข้ารหัส เช่น `yyyyMMddHHmmssSSS` หรือแบบไม่มีมิลลิวินาที

#### getFormatDate
- **Parameters:** `date: Date = new Date()`, `fortype: number = this.SHORT`, `delimiter: string = " "`, `forstyle: number = this.NORMAL`, `separater: string = ","`
- **Returns:** `string`
คืนค่าวันที่แบบจัดรูปแบบปรับแต่งได้เองว่าเดือนจะเป็นชื่อเต็มหรือย่อ ปกติหรืออินเตอร์

#### getShortDate
- **Parameters:** `date: Date = new Date()`, `delimiter: string = " "`, `forstyle: number = this.NORMAL`
- **Returns:** `string`
คืนค่าวันที่เป็นชื่อเดือนย่อเช่น `12 Oct 2026`

#### getLongDate
- **Parameters:** `date: Date = new Date()`, `delimiter: string = " "`, `forstyle: number = this.NORMAL`
- **Returns:** `string`
คืนค่าวันที่เป็นชื่อเดือนเต็มรูปแบบเช่น `12 October 2026`

#### getWeekDay
- **Parameters:** `date: Date = new Date()`, `fortype: number = this.LONG`
- **Returns:** `string`
แสดงชื่อวันในสัปดาห์ เช่นจันทร์ อังคาร ตามรูปแบบ

#### getShortWeekDay
- **Parameters:** `date: Date = new Date()`
- **Returns:** `string`
แสดงชื่อในวันสัปดาห์แบบย่อ

#### getLongWeekDay
- **Parameters:** `date: Date = new Date()`
- **Returns:** `string`
แสดงชื่อในวันสัปดาห์แบบยาว

#### getFormatWeekDate
- **Parameters:** `date: Date = new Date()`, `fortype: number = this.LONG`, `delimiter: string = " "`, `forstyle: number = this.NORMAL`, `separater: string = ","`
- **Returns:** `string`
คืนผลลัพธ์เป็นข้อความที่มีทั้งส่วนวันและวันที่ เช่น "Monday, 12 October 2026"

#### date
- **Parameters:** `input?: string | number`, `defaultValue?: Date`
- **Returns:** `Date`
ดึงหรือสร้าง Date ใหม่จากข้อความหรือตัวเลข timestamps ที่ให้มา

#### hasValue
- **Parameters:** `val: any`
- **Returns:** `boolean`
ตรวจสอบว่าตัวแปรมีค่าอยู่จริงและไม่เป็น null/undefined/ว่าง

---

## random.util

### Variables and Values
| Variable | Value | Description |
| --- | --- | --- |
| `ALPHABETS` | `Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")` | อาเรย์ของตัวอักษรและตัวเลขทั้งหมดสำหรับพิมพ์ |
| `NUMERICS` | `Array.from("0123456789")` | อาเรย์ของตัวเลขทั้งหมด 0 ถึง 9 |

### Methods

#### getRandomNumber
- **Parameters:** `min: number = 1`, `max: number = 1000000`
- **Returns:** `number`
ทำการสุ่มจำนวนเต็มระหว่างค่า `min` และ `max` อย่างสม่ำเสมอเท่าๆ กัน

#### random
- **Parameters:** `len: number = 6`, `alphabets: string[] = ALPHABETS`
- **Returns:** `string`
สุ่มสร้าง string มามีความยาวเป็น `len` จากตัวอักษรที่กำหนดใน `alphabets`

#### randomNumber
- **Parameters:** `len: number = 6`, `alphabets: string[] = NUMERICS`
- **Returns:** `string`
สุ่มสร้างสตริงที่เป็นเพียงกลุ่มตัวเลข (PIN Code) เท่านั้นมีความยาวตามกำหนด

---

## jquery.util

### Methods

#### getJQuery
- **Parameters:** (None)
- **Returns:** `JQueryStatic`
ตรวจสอบและเรียกคืนค่าการกำหนดตัวแปรของไลบรารี jquery สำหรับเข้าถึงทั้งใน global scope และ window 

---

## dh

คลาสสำหรับจัดการการเข้ารหัสลับ Diffie-Hellman แบบปรับแต่งเองเพื่อใช้ในการแลกเปลี่ยนกุญแจระหว่างไคลเอ็นต์

### Methods (Functions)

#### getPrimeNumber
- **Parameters:** (None)
- **Returns:** `number`
ระบบทำการสุ่มเลขจำนวนเฉพาะระหว่าง 1000 ถึง 10000

#### modPowInt
- **Parameters:** `base: bigint`, `exp: bigint`, `mod: bigint`
- **Returns:** `bigint`
ฟังก์ชั่นหาค่ายกกำลังจำนวนเต็มพร้อมโมดูโล (Modular exponentiation) ที่รวดเร็ว

### Methods (in DH class)

#### constructor
- **Parameters:** (None)
ทำการสุ่ม generate ค่าคีย์ต่างๆ เช่น privateKey, publicKey, generator และ prime ขึ้นใหม่เตรียมเอาไว้เบื้องต้น

#### encryptText
- **Parameters:** `word: string`, `keyBase64: string`
- **Returns:** `string`
เข้ารหัสข้อความคำศัพท์ด้วย Advanced Encryption Standard (AES) โหมด ECB ให้กับข้อความ `word` ที่มาพร้อมตัวเข้ารหัส `keyBase64`

#### decryptText
- **Parameters:** `word: string`, `keyBase64: string`
- **Returns:** `string`
ถอดรหัสข้อความ AES ข้อมูลมาเป็นคำดั้งเดิมแบบข้อความดิบตามค่า `keyBase64`

#### encrypt
- **Parameters:** `word: string`
- **Returns:** `string`
เข้ารหัสคำศัพท์โดยใช้ `sharedKey` ของการเจรจาระหว่างสองฝั่งเข้ารับงาน ด้วยการเข้าทำ SHA256 ก่อนนำมาเป็นชุด key เข้ารหัสแบบ AES

#### decrypt
- **Parameters:** `word: string`
- **Returns:** `string`
ถอดรหัสโดยกระทำในทางตรงกันข้ามกับ `encrypt` ผ่าน `sharedKey` เป็นแบบ AES ของผู้ที่มีกุญแจสองฝั่งตรงกัน

#### computePublicKey
- **Parameters:** (None)
- **Returns:** `void`
คำนวณ publickey โดยนำ `generator` ยกกำลัง `privateKey` และโมดูโลด้วย `prime` ของตน 

#### computeSharedKey
- **Parameters:** (None)
- **Returns:** `void`
คำนวณ private shared key เพื่อความปลอดภัยโดยนำ `otherPublicKey` ดำเนินการผ่าน `prime` และทับ `privateKey` ให้เข้ารูป

#### compute
- **Parameters:** (None)
- **Returns:** `void`
เรียกกระบวนการและทริกเกอร์ `computePublicKey` และ `computeSharedKey` ร่วมกัน

#### requestGenerator
- **Parameters:** `callback?: Function`, `aurl?: string`
- **Returns:** `void`
ทำการยิงร้องของค่า prime, generator ทางแม่ข่าย

#### getAccessorInfo
- **Parameters:** (None)
- **Returns:** `any`
ดึงข้อมูลผู้มีสิทธิ์ใช้งานปัจจุบัน

#### getAccessorToken
- **Parameters:** (None)
- **Returns:** `string`
ดึงรหัสโทเคนยืนยันตัวตนปัจจุบัน (Token Authentication) ของผู้ใช้ระบบ

#### getRequestID
- **Parameters:** (None)
- **Returns:** `string`
ดึงหมายเลข ID สำหรับการร้องขอปัจจุบันแยกแต่ละรายการแบบสุ่ม

#### requestPublicKey
- **Parameters:** `dh?: DH`, `callback?: Function`, `aurl?: string`
- **Returns:** `void`
ทำการทำ Post request เพื่อคุยกับเซิฟเวอร์ให้คำนวณคือกุญแจสาธารณะ

#### submitPublicKey
- **Parameters:** `callback?: Function`, `aurl?: string`
- **Returns:** `void`
ทำการทำแบบสอบรับและยืนยันสาธารณะชนอีกรอบด้วย Post AJAX

#### updatePublicKey
- **Parameters:** `callback?: Function`, `aurl?: string`
- **Returns:** `void`
อัปเดตและแจ้งกุญแจให้เป็นค่าล่าสุดขึ้นแม่ข่าย
## app.info

ฟังก์ชันใช้งานสำหรับอ่านและเขียนข้อมูลโปรไฟล์, สภาพแวดล้อมระบบการทำงานของระบบแอปพลิเคชัน

### Methods

#### getConfig
- **Parameters:** `key: string`
- **Returns:** `any`
ดึงข้อมูลตั้งค่าเฉพาะระบบระบุตามคำ `key`

#### getAppInfo
- **Parameters:** (None)
- **Returns:** `any`
ดึงข้อมูลกำหนดสภาพแวดล้อมแอปพลิเคชันปัจจุบัน

#### registerNotification
- **Parameters:** `callback: Function`
- **Returns:** `void`
ฝากการรับฟังก์ชั่นระบบ callback เพื่อรอดักจับข้อมูลเปลี่ยนภาษาในอนาคต

#### getMultiLanguages
- **Parameters:** (None)
- **Returns:** `string[]`
ดึงรายชื่อภาษาที่สามารถใช้ได้ปัจจุบัน

#### setMultiLanguages
- **Parameters:** `values: any`
- **Returns:** `void`
เซตปรับกลุ่มอาเรย์ภาษา

#### getDefaultLanguage
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงค่าติดตั้งภาษาตั้งต้นที่ระบุตามระบบ

#### setDefaultLanguage
- **Parameters:** `language: string`
- **Returns:** `void`
เซตปรับภาษาตั้งต้นให้ระบบ

#### getApiToken
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงสตริงตั้งต้นที่เป็น API token คงที่

#### getApiUrl
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงข้อมูล Base URL ของ API ต้นทาง

#### getBaseUrl
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึง URL ตั้งต้นของเซิฟเวอร์ที่โฮสแอปนี้อยู่ตาม Config

#### getCdnUrl
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึง URL CDN สำหรับส่งเข้าระบบ Content Delivery Network

#### getImgUrl
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึง URL ที่เก็บการแสดงไฟล์รูปภาพ

#### getChatUrl
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึง URL สำหรับตัว Chat Server ที่ติดตั้งในโซลูชัน

#### getBaseStorage
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงค่าที่อยู่บันทึกประวัติเป็นแบบ localStorage หรือระบุอื่นผ่าน Base Storage Config

#### getDefaultRawParameters
- **Parameters:** (None)
- **Returns:** `boolean`
ตรวจสอบว่าระบบพารามิเตอร์ของระบบมีการจัดการแบบดั้งเดิมไม่ได้เข้ารหัสหรือไม่

#### getBaseCss
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงไฟล์กำหนดคลาส CSS ล่าสุดของสภาพแวดล้อมโปรแกรม

#### isSecureStorage
- **Parameters:** (None)
- **Returns:** `boolean`
ตรวจสอบการเข้ารหัส Secure LocalStorage หรือไม่ตามตัวตั้งค่าของแอปพลิเคชันปัจจุบัน

#### getTokenKey
- **Parameters:** (None)
- **Returns:** `string | undefined`
ดึงเอา Session token key ปัจจุบันที่ได้มา

#### getMetaInfo
- **Parameters:** (None)
- **Returns:** `any`
ดึงเมตาดาต้า (Meta information object) สแนปช็อตแบบครอบคลุมอื่นๆ ทั้งหมด

#### _Setters & Others Configuration (_set...) 
นอกเหนือจาก Getter ทั้งหมด หากเป็น `setApiToken`, `setApiUrl`, `setBaseUrl`, `setCdnUrl`, `setImgUrl`, `setChatUrl`, `setBaseStorage`, `setDefaultRawParameters`, `setSecureStorage`, `setBaseCss`, `setTokenKey`, `setMetaInfo` ล้วนทำหน้าที่เหมือน Setter รับค่า parameter ทับค่าภายในของ config ปัจจุบัน

#### getProgramMessage / getProgramLabels / getDefaultLabels
- **Parameters:** (None)
- **Returns:** `Array<any>`
ดึงข้อมูลคลังเก็บภาษาสำหรับการใช้งานแบบ Message หรือ Label สำหรับภาษาต่างๆ

#### setProgramMessage / setProgramLabels / setDefaultLabels
- **Parameters:** `message/labels: Array<any>`
- **Returns:** `void`
สั่งทับค่าคลังเก็บภาษาเป็นก้อนข้อมูลใหม่

#### isDisplayPageHeader
- **Parameters:** (None)
- **Returns:** `boolean`
ตรวจสอบดูข้อมูล Meta info ว่าสถานะให้การบังคับแสดงหัวตารางหรือไม่

#### appInit
- **Parameters:** `options?: any`, `callback?: Function`, `draggable?: Function`
- **Returns:** `void`
เริ่มการตั้งค่าการจัดเตรียมดึงการแลกเปลี่ยน message, label พื้นฐานจากหน้าต่าง

#### getMultiLanguagesModel
- **Parameters:** `datas?: any`
- **Returns:** `any[]`
คืนค่าอาเรย์ตัวเลือก (dropdown array objects) เผื่อใช้สำหรับเลือเปลี่ยนภาษา

#### assignAppConfig
- **Parameters:** `data: any`, `callback?: Function`
- **Returns:** `void`
ประมวลผลเซตตค่าตัวกำหนดพารามิเตอร์ตาม `data` อย่างฉลาด

#### loadAppConfig
- **Parameters:** `callback?: Function`, `url: string = "../config/app.config.json"`
- **Returns:** `void`
รีโหลดอ่านไฟล์ข้อมูลการเซตค่าของระบบจาก json URL (ajax fetch payload)

#### initConfigure
- **Parameters:** (None)
- **Returns:** `void`
ตรวจสอบข้อมูล Storage key และ URL browser params สำหรับเตรียมอัพเดตค่าของ tokenkey เบื้องต้น

#### initAppConfig
- **Parameters:** `callback?: Function`, `draggable?: Function`
- **Returns:** `void`
ประมวลผลดึงตัวแปรใน global window สู่การจัดการสภาพแวดล้อมระบบ

---

## app.util

ฟังก์ชันระดับสูงสำหรับรองรับการแสดงผลทั่วไปทั้งตาราง กล่องรับค่า และจัดการหน้าต่างโปรแกรม

### Methods

#### getChildWindows
- **Parameters:** (None)
- **Returns:** `any[]`
ดึงหน้าต่าง (frames / modal window) ที่โปรแกรมสร้างอยู่

#### setDragFunction
- **Parameters:** `func?: Function`
- **Returns:** `void`
แนบตัวทำงานควบคุม draggable เพื่อดึงการแสกนเมื่อสร้างกล่อง modal

#### getWindowOpen
- **Parameters:** `win: any`
- **Returns:** `any`
ดึงหน้าต่างแบบระบุ win จากในที่เปิดอยู่

#### getWindowByName
- **Parameters:** `winname: string`
- **Returns:** `any`
ค้นหาเปรียบเทียบจากตัวแปรชื่อตรงในวินโดว์ว่าเปิดทิ้งหรือใหม่

#### closeChildWindows
- **Parameters:** (None)
- **Returns:** `void`
สั่งปิดป๊อปอัพ window ที่เคยค้างใน session ทั้งหมด

#### addWindow
- **Parameters:** `awindow: any`
- **Returns:** `void`
เพิ่มหน้าต่างป๊อปอัปเข้าสู่รายการในหน้าหน่วยความจำปัจจุบัน

#### buildFormParams
- **Parameters:** `frm: any`, `params: any`
- **Returns:** `void`
จัดการและวาด input กล่องฟอร์มซ่อนเตรียมอัพด้วย HTML DOM บนหน้า UI ตาม `params`

#### submitWindow
- **Parameters:** `settings: any`
- **Returns:** `void`
ทำรายการยิงข้อมูล `settings.params` ส่งไปยัง URL แบบ POST ไปที่หน้าวินโดว์ต่างๆ ชั่วคราวบนพื้นหลังหน้าต่าง

#### openNewWindow
- **Parameters:** `settings: any`
- **Returns:** `any`
เปืดหน้าต่างบราวเซอร์แยกหรือแท็บใหม่ตาม `settings` พร้อมด้วยพารามิเตอร์ปรับสเกลขนาดอย่างลงตัว

#### startWaiting / stopWaiting
- **Parameters:** (None)
- **Returns:** `void`
ควบคุมการแสดงภาพฉาก Loading screen หรือหยุดการทำงานการหมุนเมื่อระบบประมวลผลเสร็จ

#### submitFailure
- **Parameters:** `xhr?: any`, `status?: number | string`, `errorThrown?: string`, `checking = true`
- **Returns:** `void`
โชว์ข้อผิดพลาดถ้าดักเจอการสื่อสาร Network error หรือเซิฟเวอร์ขัดข้องระหว่างเชื่อมต่อ

#### parseErrorThrown
- **Parameters:** `xhr?: any`, `status?: number | string`, `errorThrown?: string`
- **Returns:** `string`
หาข้อความเออเร่อที่เป็นไปได้มากที่สุดใน Response payload หากเข้าไม่ได้ หรือเจอ API Error 

#### detectErrorResponse
- **Parameters:** `data: any`
- **Returns:** `boolean`
โชว์แจ้งเตือนอัตโนมัติเกี่ยวกับ JSON error flag หากพบจากฝั่งเซิฟเวอร์ตรวจสอบอย่างใกล้ชิด

#### successbox / warningbox
- **Parameters:** `errcode?: string|Function`, `callback?: Function`, `params?: any`
- **Returns:** `void`
โชว์กล่องข้อความความสำเร็จผ่าน SweetAlert / Bootbox และรวมก้อนแจ้งเตือนเฉพาะ Warningbox ด้วย `errcode` ที่จัดเตรียมสำหรับเตือนในกรณีต่างๆ 

#### alertbox / alertDialog
- **Parameters:** `errcode: string` หรือ `msg: string`, `callback?: Function`, `defaultmsg?: string`, `params?: any`, `addonmsg?: string`, `title?: string`, `icon?: string`
- **Returns:** `void`
ส่งออกการเตือนด่วนเกี่ยวกับสิ่งที่ไม่คาดคิดเข้าหน้าระบบพร้อมปุ่มตกลง

#### alertDialogBootBox / alertDialogSweetAlert
- **Parameters:** `msg?: string`, `callbackfn?: Function`, `title?: string`, `icon?: string`
- **Returns:** `void`
สั่งดึงการวาดกล่อง Alert จาก bootbox หรือ sweetalert ตรง

#### confirmbox / confirmDialog
- **Parameters:** `errcode: string` หรือ `msg: string`, `okFn?: Function`, `cancelFn?: Function`, ...
- **Returns:** `boolean`
โชว์กล่องข้อความเลือกคำตอบ ยืนยัน ไม่ยืนยัน ตอบสนองต่อการเลือกแบบ callback

#### confirmDialogBox
- **Parameters:** `errcode: string`, `params?: any`, `defaultmsg?: string`, `okFn?: Function`, `cancelFn?: Function`, `addonmsg?: string`
- **Returns:** `boolean`
อ้างอิงส่งค่าไปยัง `confirmbox` เป็น alias ชื่อเข้าผ่านฟังก์ชันที่คล่องแคล่ว

#### confirm... (ตระกูลระบบ Confirm อื่นๆ เช่น Delete, Save, Update, Send, Clear)
- **Parameters:** `okFn?: Function`, `cancelFn?: Function` บ้างอาจมีพารามิเตอร์ขยาย
- **Returns:** `boolean`
เรียกพฤติกรรม `confirmDialogBox` ร่วมกับค่าคงที่ของ Code การส่งเช่น QS0001 สำหรับสั่งแจ้งเตือนลบ ก่อนทำงาน

#### startApplication
- **Parameters:** `pid: string`, `callback?: Function`
- **Returns:** `void`
รีเซตค่าปิดระบบการเฝ้าระวังผู้ใช้และการวาดกล่องหน้าต่างเวลาหน้าโหลดดักหน้าเพจใหม่ก่อนเริ่มทำงาน

#### setupApplication
- **Parameters:** `callback?: Function`
- **Returns:** `void`
ทำเรื่องขอรหัสโทเคนเพื่อเริ่มแอปและร้องประมวลผลกลับทางหน้าต่าง `callback` ทันที

#### serializeParameters
- **Parameters:** `parameters?: any`, `addonParameters?: any`, `raw?: boolean`
- **Returns:** `any`
รวบรวมตัวแปรเพื่อเป็น payload โดยตรวจสอบด้วยการเข้ารหัส `DH` หากไม่ต้องใช้รูปแบบดิบ และส่งเป็น String 

#### decryptCipherData
- **Parameters:** `headers: any`, `data: any`
- **Returns:** `any`
รับออบเจกท์เข้ารหัสมาจากหน้าการดึงข้อมูลเพื่อแกะถอดรหัสในก้อน `data` ให้ออกมาเหมือนเดิมผ่าน Shared Key

#### createLinkStyle
- **Parameters:** `css_url?: string`
- **Returns:** `void`
บังคับวาด stylesheet element link ฉีดเข้า head ระบบแบบ runtime

#### disableControls
- **Parameters:** `...elements: any[]`
- **Returns:** `void`
ระงับปุ่มต่างๆ ชั่วขณะแล้วสามารถคลิกได้อีกครั้งหลังจากเสร็จสิ้นระบบ delay ระบุการหน่วง

#### generateUUID / getRequestID
- **Parameters:** (None)
- **Returns:** `string`
สร้างและดึงรูปแบบสุ่มของ UID รุ่นมาตรฐานสำหรับการขอหน้าต่าง

#### resetRequestID
- **Parameters:** (None)
- **Returns:** `void`
สั่งลบล้าง UUID ระบบการขอครั้งล่าสุด

#### randomize
- **Parameters:** (None)
- **Returns:** `number`
ทำการเรียกค่าการสุ่มตามอุปกรณ์ผ่าน `crypto` ที่มีความปลอดภัยการคาดเดาต่ำมากเมื่อเทียบกับ `Math.random`


---

## ctrl.util

ระบบฟังก์ชันจัดการกรอกข้อมูลควบคุมการควบคุม DOM UI ด้วยชนิดอินพุตและองค์ประกอบต่างๆ

### Methods

#### getControlClasses
- **Parameters:** `attrClass: string`, `...classes: string[]`
- **Returns:** `string`
รวมตัวกำหนดพารามิเตอร์คลาสที่มีอยู่ใน `attrClass` ถ้าไม่มีก็จะเพิ่มอันใหม่ให้เป็นข้อความ

#### clearCalendar / openCalendar
- **Parameters:** `src: any`
- **Returns:** `void`
ล้างค่าและสั่งเปิดระบบ UI ของ jquery-ui DatePicker ซึ่งทำการเล็งไปที่อินพุตปุ่ม

#### triggerInput
- **Parameters:** `input: any`
- **Returns:** `void`
ปล่อยเหตุการณ์สั่งจำลองการกรอกใส่ปุ่มบนหน้าเว็บเพื่อทดสอบอัพเดตค่าของ React.js / Vue.js สับเซ็ต

#### inputNumberOnly
- **Parameters:** `element: any`, `event: any`, `decimal?: number | string`, `isPlus?: boolean`
- **Returns:** `boolean`
ฟิลเตอร์ไม่ให้พิมพ์คีย์บอร์ดนอกจากตัวเลขและตั้งค่าจุลภาค ทศนิยม หรือค่าติดลบ ให้ผู้ใช้งาน

#### checkInputNumberOnly
- **Parameters:** `myfield: any`, `e: any`, `decimal: number|string`, `isPlus: boolean`
- **Returns:** `boolean`
ตรวจจับและส่งค่าต่อยัง `inputNumberOnly` พร้อมเช็คจุดปุ่มว่ากระทำหรือไม่ใน keyup

#### checkInputKey
- **Parameters:** `myfield: any`, `event: any`, `decimal: number|string`, `maxvalue: number|string`
- **Returns:** `void`
จัดเรียงและใส่จุดจุลภาคระหว่างดึงการกดปุ่มอัตโนมัติและจำค่าเคอเซอร์เมื่อพิมพ์

#### cleasingValues
- **Parameters:** `element: any`, `valueBfChange: any`, `fraction: any`, `point: number`, `data: any`
- **Returns:** `[any, boolean]`
ทำความสะอาดตัวอักษร 0 และหลักส่วนทศนิยมผิดปกติออกตามค่าจุดประมูลและคืนสถานะการจัดระเบียบ

#### formatNumber
- **Parameters:** `element: any`, `maxvalue: number|string`, `decimal: number|string`
- **Returns:** `void`
ควบคุมปรับกล่องตัวเลขเมื่อดึงจากฐานข้อมูลเพื่อใส่ในอินพุตที่มีเครื่องหมายคั่นลูกน้ำและแก้ไขอัตโนมัติ

#### putComma / clearComma
- **Parameters:** `data: string`
- **Returns:** `string`
ใส่แทรกลูกน้ำหลักพันแบบสตริงและตัดลูกน้ำคั่นหลักพันทั้งหมดออกคืนสตริงตัวเลขตามลำดับ

#### getCaretPosition / setCaretPosition
- **Parameters:** `ctrl: any`, `iCaretPos?: number`
- **Returns:** `number` / `void`
จัดการหาและตั้งตำแหน่ง Cursor ใน input เพื่อชี้ระหว่างพิมพ์

#### parseNumber / removeComma / removeDelimiter
- **Parameters:** `avalue: string`, `delimiter?: string`
- **Returns:** `number` / `string`
ดึงข้อมูลเลขตัดทอนจุลภาค / ตัดออกในแบบสตริง / และตัดอักษรใดๆ พิเศษได้

#### formatFloating
- **Parameters:** `avalue: string`, `decimal: number`
- **Returns:** `string`
คืนค่าทศนิยมข้อความสมบูรณ์ที่ผ่านจัดระเบียบจุดแล้ว

#### formatDecimal
- **Parameters:** `avalue: any`, `decimal: number`, `verifydecimal: boolean`
- **Returns:** `string`
บังคับเติมทศนิยมให้เต็มจำนวนช่องว่างเพื่อรองรับข้อมูลให้โชว์

#### ensureTableSetting
- **Parameters:** `settings: any`
- **Returns:** `any`
รวบรวมกำหนดจัดคลาสไอคอนและปุ่มตารางที่รับมาเข้าสู่หน้าต่าง HTML (edit/delete/view)

#### formatDataTable
- **Parameters:** `data: any`, `field: any`
- **Returns:** `any`
ปรับเปลี่ยนช่องเซลส์ตารางข้อมูลอัตโนมัติตามประเภท DECIMAL หรือ DATE, DATETIME ของ data


---

## label.util

คลาสช่วยจัดการป้ายกำกับและการรองรับภาษาของระบบ

### Methods

#### getLabel
- **Parameters:** `name: string`, `defaultLabel: string`, `lang = getDefaultLanguage()`
- **Returns:** `any`
ดึงข้อมูลข้อความหรือป้ายชื่อจากในภาษาและหากไม่ได้ให้คืนเป็น `defaultLabel`

#### getLabelItem / getLabelObject
- **Parameters:** `name: string` (สำหรับ Item) หรือ `lang?: string`, `label_category: Array<any>`
- **Returns:** `any`
ดึง Object ค้นหาสินค้าหรือชนิดป้ายในกลุ่มภาษาอังกฤษและภาษาเป้าหมายเพื่อตอบอักษรคืน

#### getLabelModel
- **Parameters:** `lang = getDefaultLanguage()`
- **Returns:** `any`
ประสานพจนานุกรมของ Program Labels และ Default Labels ของหมวดหมู่นั้นเข้าเป็นก้อนเพื่อใช้ประโยชน์

#### getApiLabel
- **Parameters:** (None)
- **Returns:** `string`
ดึง URL เต็มสำหรับการดึงข้อมูลข้ามเซิฟเวอร์ API ในหมวดหมู่ดึงสัญลักษณ์ข้อความหน้าเว็บ

#### mergeProgramLabels
- **Parameters:** `data_labels: any`
- **Returns:** `boolean`
ประสานข้อความใหม่รับจากระบบเข้าสู่ ProgramLabels คลังข้อมูลป้ายชื่อของระบบตัวเองปัจจุบัน

#### loadAndMergeLabel / loadAndMergeProgramLabel
- **Parameters:** `id: string`, `callback?: Function`, `loadLabel: boolean`, `url: string`
- **Returns:** `void`
เริ่มต้นทำการตรวจสอบและโหลดผ่าน AJAX ของ ป้ายชื่อ/ป้ายโปรแกรม และรอใส่เมื่อเชื่อมเซิฟเวอร์ด้วย Cache Session

#### fetchLabel
- **Parameters:** `id: string`, `callback: Function`, `url: string`
- **Returns:** `void`
ยิงคำร้องแบบดึงฉาบฉวยสำหรับตรวจสอบหน้าเว็บป้ายชื่อและโยนกลับเข้า `callback`
## messenger

คลาสสำหรับการจัดเก็บของแคช Session Storage การส่งข้อความภายใน iframe หรือการขอรหัสโทเคน

### Methods

#### getSecureEngine
- **Parameters:** (None)
- **Returns:** `any`
ดึงเครื่องมือ `SecureLS` ที่สร้างสำหรับการจัดเก็บถอดหรือเข้าข้อความลง local storage หากระบบมีการเข้ารหัส

#### setMessagingCallback
- **Parameters:** `callback?: Function`
- **Returns:** `void`
บันทึก callback เอาไว้ให้ระบบส่งกลับทันทีเมื่อหน้าสื่อสาร iframe โหลดสำเร็จ

#### setCurrentWindow / getCurrentWindow
- **Parameters:** `curwin: any`
- **Returns:** `any`
เช็ตและตรวจดึงหน้าต่างแอปพลิเคชันปัจจุบันเอาไว้สำหรับการตรวจสอบ iframe

#### getStorage / setStorage / removeStorage
- **Parameters:** `key: string`, `value?: string`
- **Returns:** `any` / `void`
ฟังก์ชันช่วยสำหรับการดึงค่า เซฟบันทึก หรือ ลบ คีย์กับค่าที่ระบุใน Storage แบบมีความปลอดภัยด้วย

#### getAccessorInfo / saveAccessorInfo / removeAccessorInfo
- **Parameters:** `json?: any`
- **Returns:** `any` / `void`
ดึงหรือบันทึกก้อน JSON การเชื่อมต่อสิทธิใช้งานหลัก หรือสั่งลบทิ้งทั้งหมด

#### getAccessorToken / getAccessTokenKey
- **Parameters:** (None)
- **Returns:** `string`
ดึงกุญแจสำคัญสิทธิใช้งานหรือค่าโทเคนของบัญชีหลักที่ได้ทำการยืนยันแล้ว

#### sendMessageInterface / sendMessageToFrame
- **Parameters:** `type: string` / `data: any`, `win?: any`
- **Returns:** `boolean`
บังคับส่งข้อความสั่งทำงานให้แก่วินโดว์แบบระบุ หรือส่งไปยังทุก ๆ กรอบใน UI (Post Message API)

#### requestAccessorInfo
- **Parameters:** `callback?: Function`
- **Returns:** `boolean`
ทำคำขอผ่านแม่ข่าย/หน้าเพจผู้ให้กำเนิดเพื่อร้องขอโทเคนเริ่มต้นการทำงาน

#### sendMessageToParent / sendMessageToOpener
- **Parameters:** `data: any`
- **Returns:** `boolean`
จำแนกการส่งข้อความย้อนไปยังพ่อที่ครอบคลาส IFrame (Parent) หรือหน้าต่างบราวเซอร์ที่สั่งเปิด (Opener)

#### handleRequestMessage
- **Parameters:** `data: any`
- **Returns:** `void`
คอยรอการรับเหตุการณ์ร้องขอจากฝั่งหน้าต่างเมื่อคุยแลกเปลี่ยนโทเคนกันไปมาโดยทำการเซตตั้งค่าข้อมูลระบบ

#### setupDiffie
- **Parameters:** `json: any`
- **Returns:** `void`
ถอดและเรียบเรียงการยื่นข้อตกลงแบบ Diffie Hellman Key Exchange จาก json การรับค่า

#### getDH
- **Parameters:** (None)
- **Returns:** `DH | null`
ดึงข้อมูลออบเจกท์ class DH จาก AccessorInfo ที่พร้อมใช้งาน

#### bindingChildMessaging / bindingParentMessaging
- **Parameters:** `callback?: Function`
- **Returns:** `void`
ผูก Event Listener ของ window ระบบให้รองรับการสั่งจากหน้าต่างลูกไปยังพ่อ หรือพ่อไปยังลูกผ่าน `postMessage`

---

## msg.util

### Methods

#### getMessageCode
- **Parameters:** `errcode: string`, `params?: Array<any>`, `defaultMessage?: string`
- **Returns:** `string`
ขอสกัดประโยคหรือข้อความด้วยรหัส Code (และยัดตัวแปรในรูด้วย `params`) หากหาไม่เจอจะเอา Default

#### replaceString
- **Parameters:** `str: string`, `arrStr?: Array<any>`
- **Returns:** `string`
ทำหน้าที่ค้นหา `%s` ในสายประโยคและแทนที่ตัวอักษรด้วยคำใน `arrStr`

#### mergeMessageCodes
- **Parameters:** `data_messages: any`
- **Returns:** `boolean`
ควบรวมสายอาเรย์ข้อมูล error ของชุดใหม่ลงรายการที่มี

#### getApiMessageCode
- **Parameters:** (None)
- **Returns:** `string`
ดึงข้อมูลค่าลิ้งค์ URL สำหรับการส่งอ่านฐานดึงข้อความ

#### loadAndMergeMessageCode
- **Parameters:** `callback?: Function`, `loadMessageCode: boolean`, `url: string`
- **Returns:** `void`
โหลดก้อนข้อมูลแจ้งข้อความหรือข้อขัดข้องและตรวจสอบว่าเคยมีก่อนหน้าแล้วไหม ก่อนจะเซฟจัดเก็บและประสานร่าง

#### fetchMessageCode
- **Parameters:** `code?: string`, `callback?: Function`, `url: string`
- **Returns:** `void`
ใช้งาน Ajax ดึงข้อมูลแจ้งเตือนรหัสต่างๆ จาก API ปลายทางทันที

---

## Paging

เครื่องมือสำหรับการแบ่งหน้าข้อมูลผลลัพธ์ในการสืบค้นอย่างง่าย

### Methods

#### constructor
- **Parameters:** `setting?: any`
สร้างและนำเข้าตั้งค่าแบบ PagingOffsetsInfo หากไม่ใส่จะประยุกต์ใช้ตั้งต้น (10 รายการ ต่อ 1 หน้า)

#### clear / reset
- **Parameters:** `setting: Object` (หากมี)
- **Returns:** `void`
สั่งลบล้างรายการผลลัพธ์เป็นค่าติดลบ หรือเริ่มให้กำหนดตั้งค่าใหม่ทับ `setting` โดยที่การเคลียร์คือนำ Default สวม

#### hasPaging
- **Parameters:** `rows: number`
- **Returns:** `boolean`
ตรวจสอบดูว่าสามารถมีข้อมูลตัดแบ่งหน้าได้หรือไม่ (ถ้ามีรายการเกินที่จะแสดงในหนึ่งหน้า)

#### recordsOffset
- **Parameters:** (None)
- **Returns:** `number`
ทำนายและประเมินผลลัพธ์จุด Offset ลำดับล่างสุดในหน้าเพจนั้น ๆ

#### recordsNumber
- **Parameters:** `seqno: number`
- **Returns:** `number`
ดึงหมายเลขประจำตัวเรคคอร์ดจากหมายเลขหน้าที่ปรากฏและชี้คีย์ตำแหน่งจริง

#### buildPagingModel
- **Parameters:** `opts?: any`
- **Returns:** `PagingNumberInfo[]`
คำนวณและสร้างรายชื่อปุ่มหน้า (ได้แก่ >>, >, |, เบอร์เลขหน้า 1 2 3) สำหรับเอาไว้วาดหน้าแสดงผล

---

## KnMask

ใช้สำหรับบดบังข้อมูลอ่อนไหวตามความเหมาะสมก่อนเปิดเผยสู่แพลตฟอร์ม

### Methods

#### constructor
- **Parameters:** `maskChar = "*"`
- **Returns:** `void`
ตั้งคลาสอินสแตนซ์พร้อมตัวบดบัง เช่น Asterisk 

#### maskingNumber
- **Parameters:** `text?: string`, `mask: string = "####-xxxx-####"`, `maskChar: string = "*"`
- **Returns:** `string`
เอาข้อความแปลงบดบังเป็นหน้ากาก หาก mask เป็น X เปลี่ยนเป็นดอกจัน แต่ถ้าเป็น # จะให้ผ่าน

#### maskingHead / maskingTail
- **Parameters:** `text?: string`, `maskLength: number = 4`, `maskChar: string = "*"`
- **Returns:** `string`
บดบังตัวอักษรตั้งแต่หัวทิ้งให้เห็นหลัง หรือทิ้งส่วนหัวและบดบังส่วนที่เหลือ

#### maskingHeadAndTail
- **Parameters:** `text?: string`, `maskLength: number = 4`, `maskChar: string = "*"`
- **Returns:** `string`
บดบังข้อมูลเหลือให้เห็นแค่ส่วนเริ่ม และส่วนสุดหลังอย่างละ `maskLength`

#### maskSensitive (and object version)
- **Parameters:** `json: any`, `attributes: string[] = ["password","pwd"]`
- **Returns:** `any`
รับค้นหาออบเจกต์ภายใน JSON กรณีพบข้อมูลที่ตรงจะเปลี่ยนสิทธิเป็น `undefined` (ลบออก) สำหรับ `maskSensitiveObject` จะทำกับ Object โดยตรง (ผ่าน by ref)

#### maskAttribute (and object version)
- **Parameters:** `json: any`, `attributes: string[] = ["password","pwd"]`
- **Returns:** `any`
รับค้นหาออบเจกต์ JSON กรณีพบข้อมูลที่ตรงจะแปลงค่าเป็น `"******"` บดบังเอาไว้

#### maskHead / maskNumber / maskTail / maskHeadAndTail
เรียกห่อหุ้มคำสั่งที่ static อย่างกลมกลืนตามอินสแตนซ์ที่กำหนด

---

## permit.util

### Permission Class
#### constructor
- **Parameters:** `setting = { }`
สร้างตัวแปรของสิทธิรองรับสิทธิพื้นฐาน insert, delete

#### canDo
- **Parameters:** `action: string`
- **Returns:** `boolean`
อ่านว่าสิทธินั้นที่กล่าวถึงในปัจจุบันยังอนุญาตและ true หรือไม่

### Methods

#### getPermitModel
- **Parameters:** `pid: string`
- **Returns:** `Permission`
ดึงอนุญาตการทำงานของตารางสำหรับโมดูล PID จากในระบบความจำที่เก็บมา และคืนเป็นคลาส

#### loadPermissions
- **Parameters:** `pid: string`
- **Returns:** `void`
สั่งเรียกโหลดข้อมูลการอนุญาติสิทธิของ PID นั้นๆ ผ่าน fetch API กับเซิฟเวอร์ระบบอนุญาต

---

## pwd.util

### Methods

#### randomPassword
- **Parameters:** (None)
- **Returns:** `string`
สร้างรหัสผ่านการสุ่มพร้อมระบบผสมผสานเวลาปัจจุบันกับรหัสเลข

#### getAlphabets / getDigits
- **Parameters:** `text?: string`
- **Returns:** `number`
นับจำนวนพยัญชนะกับตัวเลขทั้งหมดที่มีในคำเพื่อเปรียบสัดส่วน

#### isDigit / isLetter / isLowerCase / isUpperCase
- **Parameters:** `c: string`
- **Returns:** `boolean`
ตรวจสอบตัวอักษรว่าเป็นไปตามทฤษฎีนั้นหรือไม่เช่น ตัวเลข? ตัวอักษร? พิมพ์เล็ก?

#### indexOfAlphabets
- **Parameters:** `text?: string`
- **Returns:** `number`
เช็คว่าภายในประโยคมีพยัญชนะปรากฏมาที่ตำแหน่งใดเป็นครั้งแรก

#### createNewPassword
- **Parameters:** (None)
- **Returns:** `string`
ผลิตระบบรหัสผ่านใหม่แบบสุ่มที่บังคับต้องมีตัวพิมพ์ใหญ่ พิมพ์เล็กและตัวเลขในสเกลพร้อมใช้งาน

#### checkNumberOnly
- **Parameters:** `text?: string`
- **Returns:** `boolean`
พิจารณาว่าเป็นตัวเลขเพียว ๆ หมดเลยหรือไม่ในข้อความ
