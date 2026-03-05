import pickle
import pandas as pd

# load trained model
model = pickle.load(open("model.pkl","rb"))

# sample feature data
feature = pd.DataFrame([[150,4,14,2,3,7]],columns=[
    "lines_changed",
    "files_changed",
    "complexity_score",
    "developer_experience",
    "past_bug_count",
    "commit_frequency"
])

# probability prediction
risk = model.predict_proba(feature)[0][1]

print(f"Failure Risk: {risk*100:.2f}%")

if risk > 0.7:
    print("Recommendation: Manual code review required")
elif risk > 0.4:
    print("Recommendation: Moderate risk, run additional tests")
else:
    print("Recommendation: Low risk, safe to deploy")