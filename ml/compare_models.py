import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score

data = pd.read_csv("data.csv")

X = data[['lines_changed','files_changed','complexity_score',
          'developer_experience','past_bug_count','commit_frequency']]
y = data['failed']

X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2)

models = {
"Logistic Regression":LogisticRegression(),
"Random Forest":RandomForestClassifier(),
"Gradient Boosting":GradientBoostingClassifier()
}

for name,model in models.items():

    model.fit(X_train,y_train)

    preds=model.predict(X_test)

    acc=accuracy_score(y_test,preds)

    print(name,"Accuracy:",acc)