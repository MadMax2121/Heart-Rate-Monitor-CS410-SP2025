/**
 * @file heartbeat_monitor.ino
 * @brief A simple Arduino-based heart rate monitor using a pulse sensor and buzzer.
 * 
 * This sketch reads analog input from a heartbeat sensor to detect pulses,
 * calculates the current BPM (beats per minute), and gives audible feedback 
 * via a buzzer on each detected beat.
 * 
 * @author Lorenzo Orio
 * @version 1.0
 * @date 2025-05-13
 */

// --------------------- CONSTANTS ---------------------

#include <HTTPClient.h>
#include <WiFi.h>
#include <ArduinoJson.h> //v5.13.5

/// Analog pin connected to the pulse sensor.
const int sensorPin = 34;

/// Digital pin connected to the buzzer (active low).
const int buzzerPin = 23;

/// Size of the rolling signal buffer.
const int bufferSize = 50;

/// Number of intervals stored to compute BPM.
#define INTERVAL_BUFFER 10

// --------------------- GLOBAL VARIABLES ---------------------

/// Stores recent analog readings for baseline calculation.
int signalBuffer[bufferSize];

/// Current index in the signal buffer.
int bufferIndex = 0;

/// Dynamic signal baseline used for pulse detection.
int baseline = 0;

/// Stores time intervals between detected beats.
unsigned long beatIntervals[INTERVAL_BUFFER];

/// Current index in the interval buffer.
int intervalIndex = 0;

/// True if the interval buffer has been filled at least once.
bool intervalBufferFilled = false;

/// Tracks whether a pulse is currently being detected.
bool pulseDetected = false;

/// Timestamp of the last detected beat.
unsigned long lastBeatTime = 0;

/// Tracks buzzer state (on or off).
bool buzzerOn = false;

/// True if the buzzer should beep on the next loop.
bool shouldBeep = false;

/// Timestamp when the buzzer was last activated.
unsigned long buzzerStartTime = 0;

/// Current calculated BPM.
int bpm = 0;

/// Last time the BPM was printed to the Serial Monitor.
unsigned long lastBPMPrint = 0;

/// True if finger is currently on the sensor.
bool fingerOnSensor = false;

/// True if the finger was on the sensor in the last loop.
bool wasFingerOn = false;

/// Destination for database.
const char *serverURL = "https://heart-rate-monitor-cs-410-sp-2025-kbr3jv266.vercel.app/api/heart-rate";

// --------------------- SETUP ---------------------

/**
 * @brief Initializes the serial monitor and buzzer pin.
 */
void setup() {
  Serial.begin(115200);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, HIGH);  // Buzzer off (active low)
  Serial.println("🫀 Heartbeat monitor ready — place your finger.");
  delay(2000);
}

// --------------------- BASELINE ---------------------

/**
 * @brief Calculates the average of recent signal values to estimate a baseline.
 * @return int The calculated baseline.
 */
int calculateBaseline() {
  long sum = 0;
  for (int i = 0; i < bufferSize; i++) {
    sum += signalBuffer[i];
  }
  return sum / bufferSize;
}

// --------------------- BPM ---------------------

/**
 * @brief Calculates BPM from stored beat intervals.
 * @return int Estimated Beats Per Minute (BPM).
 */
int calculateBPM() {
  unsigned long intervalSum = 0;
  for (int i = 0; i < INTERVAL_BUFFER; i++) {
    intervalSum += beatIntervals[i];
  }
  return 60000 / (intervalSum / INTERVAL_BUFFER);
}

/**
 * @brief Periodically prints live BPM to the Serial Monitor.
 * @param now The current time in milliseconds.
 */
void printLiveBPM(unsigned long now) {
  if (now - lastBPMPrint >= 5000 && intervalBufferFilled) {
    lastBPMPrint = now;
    Serial.print("📊 Live BPM: ");
    Serial.println(bpm);
  }
}

// --------------------- BUZZER ---------------------

/**
 * @brief Controls the buzzer's activation in sync with heartbeat detection.
 * @param now The current time in milliseconds.
 */
void handleBuzzer(unsigned long now) {
  if (!fingerOnSensor) {
    digitalWrite(buzzerPin, HIGH);  // Turn off
    buzzerOn = false;
    return;
  }

  if (shouldBeep && !buzzerOn) {
    digitalWrite(buzzerPin, LOW);  // Turn on
    buzzerStartTime = now;
    buzzerOn = true;
    shouldBeep = false;
  }

  if (buzzerOn && now - buzzerStartTime >= 100) {
    digitalWrite(buzzerPin, HIGH);  // Turn off
    buzzerOn = false;
  }
}

// --------------------- FINGER REMOVAL ---------------------

/**
 * @brief Handles logic and messages when finger is removed from the sensor.
 */
void handleFingerRemoval() {
  if (intervalBufferFilled) {
    unsigned long total = 0;
    for (int i = 0; i < INTERVAL_BUFFER; i++) {
      total += beatIntervals[i];
    }
    int avgBPM = 60000 / (total / INTERVAL_BUFFER);
    Serial.println("----------------");
    Serial.print("📉 Finger removed. Avg BPM: ");
    Serial.println(avgBPM);
    Serial.println("----------------");
  } else {
    Serial.println("📉 Finger removed. Not enough data.");
    delay(1000);
  }

  intervalIndex = 0;
  intervalBufferFilled = false;
  bpm = 0;
}

// --------------------- PULSE DETECTION ---------------------

/**
 * @brief Detects a pulse from sensor readings and stores interval timing.
 * @param sensorValue The current sensor analog reading.
 * @param now The current time in milliseconds.
 */
void detectPulse(int sensorValue, unsigned long now) {
  int threshold = baseline + 50;

  if (sensorValue > threshold && !pulseDetected && now - lastBeatTime > 500) {
    pulseDetected = true;
    unsigned long interval = now - lastBeatTime;
    lastBeatTime = now;

    if (interval > 300 && interval < 1500) {
      beatIntervals[intervalIndex] = interval;
      intervalIndex = (intervalIndex + 1) % INTERVAL_BUFFER;
      if (intervalIndex == 0) intervalBufferFilled = true;

      if (intervalBufferFilled) {
        bpm = calculateBPM();
      }

      Serial.println("💓");
      shouldBeep = true;
    }
  }

  if (sensorValue < baseline - 30) {
    pulseDetected = false;
  }
}

//------------------ HTTP REQUEST ----------------------

/**
 * @brief Sends a http post request containing a json object of the heartbeat data
 */

void httpRequest(char *requestBody){
  HTTPClient http;
  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(requestBody);
  if(httpResponseCode > 0){
    String response = http.getString();
  } else {
    Serial.print("Error on sending POST");
    Serial.println(httpResponseCode);
  }
  http.end();
}

// --------------------- MAIN LOOP ---------------------

/**
 * @brief Main execution loop: reads sensor, updates baseline, detects pulse, and controls buzzer.
 */
void loop() {
  int sensorValue = analogRead(sensorPin);
  unsigned long now = millis();

  // Update signal buffer and baseline
  signalBuffer[bufferIndex] = sensorValue;
  bufferIndex = (bufferIndex + 1) % bufferSize;
  baseline = calculateBaseline();

  // Check for finger presence
  fingerOnSensor = sensorValue > 1000;

  // Detect finger removal
  if (wasFingerOn && !fingerOnSensor) {
    handleFingerRemoval();
  }
  wasFingerOn = fingerOnSensor;

  // Heartbeat logic
  if (fingerOnSensor) {
    detectPulse(sensorValue, now);
    printLiveBPM(now);
    //Send post request to server
    char str[100];
    int time = 3200; //dummy value for compliece with database
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject &root = jsonBuffer.createObject();
    root["heartRate"] = sprintf(str, "%d", bpm);
    root["timestamp"] = sprintf(str, "%d", time);
    root.prettyPrintTo(str, sizeof(str));
    httpRequest(str);
  } else {
    Serial.println("🕓 Waiting for finger...");
    delay(1000);
  }

  handleBuzzer(now);
  delay(10);
}
