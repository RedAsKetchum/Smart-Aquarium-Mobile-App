// AppStyles.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  imageButton: {
    width: 77,  
    height: 77, 
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
});
