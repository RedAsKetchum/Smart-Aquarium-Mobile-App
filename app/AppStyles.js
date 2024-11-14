// AppStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  imageButton: {
    width: 76,  
    height: 76, 
    borderRadius: 38,  // Half of the width and height to make a perfect circle
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    height: '100%',
  },
  textContainer: {
    width: '100%',
    minHeight: '85vh',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 8,
  },
  bottomSheetContent: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  blurContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  bottomSheetBackground: {
    backgroundColor: 'transparent',
  },
  bottomSheetHandle: {
    display: 'none',
  },

  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  // gaugeContainer: {
  //   width: 200,
  //   height: 200,
  //   flexDirection: 'row', // This ensures the gauges are side by side
  //   justifyContent: 'space-between', // Optional: Adjust spacing between gauges
  //   alignItems: 'center',
  // },
  container: {
    justifyContent: 'center',
    position: 'relative',
    //flexDirection: 'row', // This ensures the gauges are side by side TESTING
    //justifyContent: 'space-between', // Optional: Adjust spacing between gauges 
    
  
    
  },
  // svgContainer: {
  //   backgroundColor: 'transparent',
  // },
  // temperatureText: {
  //   position: 'absolute',
  //   top: 160,  // Positioned below the gauge
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: 'black'
  // },

  // title: {
  //   fontSize: 24,
  //   marginBottom: 20,
  //   fontWeight: 'bold',
  // },
  centerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  temperatureText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4500',  // Match the gauge color
  },
  buttons: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderRadius: 15, 
    marginTop: 20, 
    width: '90%', 
    height: 105,
    alignSelf: 'center', // Center the button inside ScrollView
    justifyContent: 'center', 
    alignItems: 'center'
  },

});

export default styles;
