#include "U8glib.h"
U8GLIB_ST7920_192X32_1X u8g(13, 11, 10);	// SPI Com: SCK = en = 13, MOSI = rw = 11, CS = di = 10
int sound_sensor = A2; 
int light_sensor = A3; 

void draw(const char* message1,const char* message2) {
  // graphic commands to redraw the complete screen should be placed here  
  u8g.setFont(u8g_font_unifont);
  //u8g.setFont(u8g_font_osb21);
  u8g.drawStr( 0, 11, message1);
  u8g.drawStr( 0, 25, message2);
}

void setup(void) {
  // flip screen, if required
  // u8g.setRot180();
  
  // set SPI backup if required
  //u8g.setHardwareBackup(u8g_backup_avr_spi);

  // assign default color value
  if ( u8g.getMode() == U8G_MODE_R3G3B2 ) {
    u8g.setColorIndex(255);     // white
  }
  else if ( u8g.getMode() == U8G_MODE_GRAY2BIT ) {
    u8g.setColorIndex(3);         // max intensity
  }
  else if ( u8g.getMode() == U8G_MODE_BW ) {
    u8g.setColorIndex(1);         // pixel on
  }
  else if ( u8g.getMode() == U8G_MODE_HICOLOR ) {
    u8g.setHiColorByRGB(255,255,255);
  }
  
  pinMode(8, OUTPUT);
  Serial.begin(9600);
}

void loop(void) {
  int soundValue = analogRead(sound_sensor);
  int lightValue = analogRead(light_sensor);
  char soundDisplay[20];
  char lightDisplay[20];
  sprintf(soundDisplay, "Sound: %d", soundValue);
  sprintf(lightDisplay, "Light: %d", lightValue);
  Serial.print(soundValue);
  Serial.print(" ");
  Serial.println(lightValue);

  u8g.firstPage();  
  do {
    draw(soundDisplay,lightDisplay);
  } while( u8g.nextPage() );
  
  // rebuild the picture after some delay
  delay(200);
}

