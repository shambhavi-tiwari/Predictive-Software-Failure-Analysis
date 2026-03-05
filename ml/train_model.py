import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import pickle

# Load dataset
data = pd.read_csv("data.csv")

# Features
X = data[['lines_changed','files_changed','complexity_score',
          'developer_experience','past_bug_count','commit_frequency']]

# Label
y = data['failed']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2,random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100)

model.fit(X_train,y_train)

# Evaluate
predictions = model.predict(X_test)

print("Accuracy:",accuracy_score(y_test,predictions))
print(classification_report(y_test,predictions))

# Save model
pickle.dump(model,open("model.pkl","wb"))

print("Model saved!")