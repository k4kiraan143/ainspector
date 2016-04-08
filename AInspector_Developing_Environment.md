# Set up Firebug Accessibility Inspector #

  * Install Firefox/3.6.13 or higher (to have the eventlistenerservice available)
  * Install Firebug tracing-enabled version (1.6.X.0a3) http://getfirebug.com/releases/
  * Install Extension developer Add on (0.3.0.20090902) http://ted.mielczarek.org/code/mozilla/extensiondev/ to be able to build the xpi for deployment you must have winzip.exe on your machine using FireFox's Tools/Extension Developer/ Extension Builder.
    1. **Note:** If installing winzip14.0/winzip15.0, make sure to install command line winzip too.
  * Install AInspector from http://ainspector.googlecode.com/svn/trunk/
  * Create a file under the AppData at \Mozilla\Firefox\Profiles\skd8c5nh.default\extensions\
    1. Name of the file must be similar to id for mozilla provided in the install.rdf for example., in this case it is ainspector@cita.uiuc.edu
    1. The file contains the path to the AInspector directory.          for example., C:\XFolder\AInspector
