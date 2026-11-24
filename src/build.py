s=open('src/shell.html').read()
for k,f in [('POSITIONS','positions.js'),('QUIZ','quiz.js'),('PERSO','perso.js'),('RIVE','riveglue.js'),('QUESTIONS','questions.js'),('AILLEURS','ailleurs.js'),('APP','app.js')]:
    s=s.replace('/*%s*/'%k, open('src/'+f).read(),1)
__import__('base64');open('rive/mandat27-riv.js','w').write('// Généré depuis rive/mandat27.riv (python3 src/build.py)\nwindow.MANDAT27_RIV="'+__import__('base64').b64encode(open('rive/mandat27.riv','rb').read()).decode()+'";\n')
open('index.html','w').write(s)
