import madmom
import numpy as np

proc = madmom.features.key.CNNKeyRecognitionProcessor()
print(madmom.features.key.key_prediction_to_label(proc("/Users/thomash/Desktop/organised/brasil/08 - Roberto Carlos - Jesus Cristo.mp3")))  