import { Request, Response } from 'express';
import { MeetingRepository } from '../../domain/repositories/MeetingRepository';
import { transporter } from '../useCases/Mail';
import { DateTime } from 'luxon';
import { createEvent } from 'ics';

const meetingRepository = new MeetingRepository();

export class MeetingController {
  // Crear una nueva reunión
  static async create(req: Request, res: Response) {
    const meetingData = req.body;

    console.log(meetingData);

    try {
      const meeting = await meetingRepository.create(meetingData);

      const dateStart = DateTime.fromISO(meetingData.startTime);
      const dateEnd = DateTime.fromISO(meetingData.endTime);


      // Crear el evento ICS
      const event = {
        start: [
          dateStart.year,
          dateStart.month,
          dateStart.day,
          dateStart.hour,
          dateStart.minute,
        ],
        end: [
          dateEnd.year,
          dateEnd.month,
          dateEnd.day,
          dateEnd.hour,
          dateEnd.minute,
        ],
        title: 'Reunión Programada',
        description: meetingData.description,
        location: 'Online',
        status: 'CONFIRMED',
        organizer: { name: 'Organizador', email: 'tgrado370@gmail.com' },
        attendees: [
          { name: 'Participante 1', email: meetingData.myemail, rsvp: true },
          {
            name: 'Participante 2', email: meetingData.requestMail, rsvp: true,
          },
        ],
      };

      // @ts-ignore
      createEvent(event, (error, value) => {
        if (error) {
          return res
            .status(500)
            .json({ message: 'Error al crear el evento de calendario', error });
        }

        console.log('Correo del Participante 1:', meetingData.myemail);
        console.log('Correo del Participante 2:', meetingData.requestMail);
        console.log('myemail:', meetingData.myemail);
        console.log('requestMail:', meetingData.requestMail);


        // Configuración del correo con el archivo ICS adjunto
        let mailOptions = {
          from: 'tgrado370@gmail.com', // Remitente
          to: `${meetingData.requestMail}, ${meetingData.myemail}`, // Destinatario
          subject: 'Invitación de reunión de conocimientos', // Asunto del correo
          html: `<h1>Te invitamos a una reunión programada.</h1>
          <p>Por favor, revisa el archivo adjunto para más detalles.</p>
          <p> ${meetingData.description} </p>
          `, // Contenido del correo
          icalEvent: {
            content: value,
            method: 'REQUEST',
          },
        };

        // Enviar el correo
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res
              .status(500)
              .json({ message: 'Error al enviar la invitación', error });
          }
          console.info('Correo enviado: ' + info.response);
        });

        return res.status(201).json(meeting);
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al crear la reunión', error });
    }
  }

  // Obtener todas las reuniones
  static async findAll(req: Request, res: Response) {
    try {
      const meetings = await meetingRepository.findAll();
      return res.status(200).json(meetings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener las reuniones', error });
    }
  }

  // Obtener una reunión por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const meeting = await meetingRepository.findById(id);
      if (!meeting) {
        return res.status(404).json({ message: 'Reunión no encontrada' });
      }
      return res.status(200).json(meeting);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener la reunión', error });
    }
  }

  // Actualizar una reunión por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body;

    try {
      const updatedMeeting = await meetingRepository.update(id, updatedData);
      if (!updatedMeeting) {
        return res.status(404).json({ message: 'Reunión no encontrada' });
      }
      return res.status(200).json(updatedMeeting);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al actualizar la reunión', error });
    }
  }

  // Eliminar una reunión por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await meetingRepository.delete(id);
      return res.status(200).json({ message: 'Reunión eliminada con éxito' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar la reunión', error });
    }
  }

  // Buscar reuniones por userId (organizador)
  static async findByUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);

    try {
      const meetings = await meetingRepository.findByUserId(userId);
      return res.status(200).json(meetings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener las reuniones del usuario', error });
    }
  }

  // Buscar reuniones por chatId
  static async findByChatId(req: Request, res: Response) {
    const chatId = parseInt(req.params.chatId, 10);

    try {
      const meetings = await meetingRepository.findByChatId(chatId);
      return res.status(200).json(meetings);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener las reuniones del chat', error });
    }
  }
}
