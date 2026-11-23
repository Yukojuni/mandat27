s=open('src/shell.html').read()
for k,f in [('POSITIONS','positions.js'),('QUIZ','quiz.js'),('PERSO','perso.js'),('QUESTIONS','questions.js'),('APP','app.js')]:
    s=s.replace('/*%s*/'%k, open('src/'+f).read(),1)
open('index.html','w').write(s)
