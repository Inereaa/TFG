
# + Instancia EC2
resource "aws_instance" "mi_instancia" {
  ami                        = "ami-0866a3c8686eaeeba"
  instance_type              = "t2.micro"
  key_name                   = aws_key_pair.apache_server_ssh.key_name
  subnet_id                  = aws_subnet.mi_subred_publica.id
  vpc_security_group_ids     = [aws_security_group.sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
  #!/bin/bash

  # Actualizar paquetes e instalar dependencias
  sudo apt-get update -y
  sudo apt-get install -y docker.io docker-compose git

  # Iniciar y habilitar Docker
  sudo systemctl start docker
  sudo systemctl enable docker

  # Clonar el repositorio
  sudo rm -rf /home/ubuntu/app
  sudo git clone https://github.com/Inereaa/TFG.git /home/ubuntu/app

  # Dar permisos a usuario ubuntu para docker
  sudo usermod -aG docker ubuntu

  # Ir a la carpeta donde está docker-compose.yml
  cd /home/ubuntu/app

  # Levantar los contenedores con docker-compose
  sudo docker-compose up

EOF

  tags = {
    Name = "MiInstanciaEC2"
  }
}
